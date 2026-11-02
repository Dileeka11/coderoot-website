# Builds the live files for the cPanel hosting at coderootsolutions.com.
# Run it again after any change:  powershell -ExecutionPolicy Bypass -File deploy/build-zip.ps1
#
# deploy/dist/coderoot-live.zip    extract inside the domain's folder (coderootsolutions.com). No passwords in it.
#   .htaccess                      sends each address to the right folder below
#   frontend/                      the public site, plain files built by Next.js
#   backend/                       Laravel with its packages, without .env
# deploy/dist/upload/.env          upload into coderootsolutions.com/backend/ on its own
# deploy/dist/upload/coderoot-database.sql   import in phpMyAdmin, first install only
#
# The same folder layout works for an FTP upload: frontend/ from the site build, backend/ from Laravel.

$ErrorActionPreference = 'Stop'
$deploy = $PSScriptRoot
$root = Split-Path $deploy -Parent
$php = 'C:/xampp/php/php.exe'
$mysql = 'C:/xampp/mysql/bin/mysql.exe'
$mysqldump = 'C:/xampp/mysql/bin/mysqldump.exe'
$siteUrl = 'https://coderootsolutions.com'

$dist = Join-Path $deploy 'dist'
$stage = Join-Path $dist 'stage'
$web = Join-Path $stage 'coderootsolutions.com'
$front = Join-Path $web 'frontend'
$back = Join-Path $web 'backend'
$upload = Join-Path $dist 'upload'
$sql = Join-Path $upload 'coderoot-database.sql'
$zip = Join-Path $dist 'coderoot-live.zip'
$utf8 = New-Object System.Text.UTF8Encoding($false)

function New-Secret([int]$length, [string]$alphabet) {
    $bytes = New-Object byte[] $length
    [System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
    -join ($bytes | ForEach-Object { $alphabet[$_ % $alphabet.Length] })
}

function Invoke-Checked([scriptblock]$command, [string]$what) {
    & $command
    if ($LASTEXITCODE -ne 0) { throw "$what failed with exit code $LASTEXITCODE" }
}

# 1. Values that must stay the same from one build to the next. Empty them in .env.live to get new ones.
$envFile = Join-Path $deploy '.env.live'
$envText = [IO.File]::ReadAllText($envFile)
if ($envText -match '(?m)^APP_KEY=\s*$') {
    $keyBytes = New-Object byte[] 32
    [System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($keyBytes)
    $envText = $envText -replace '(?m)^APP_KEY=\s*$', ('APP_KEY=base64:' + [Convert]::ToBase64String($keyBytes))
}
if ($envText -match '(?m)^ADMIN_PATH=\s*$') {
    $envText = $envText -replace '(?m)^ADMIN_PATH=\s*$', ('ADMIN_PATH=panel-' + (New-Secret 8 'abcdefghjkmnpqrstuvwxyz23456789'))
}
[IO.File]::WriteAllText($envFile, $envText, $utf8)
$adminPath = ([regex]::Match($envText, '(?m)^ADMIN_PATH=(\S+)')).Groups[1].Value
$adminEmail = ([regex]::Match($envText, '(?m)^ADMIN_EMAIL=(\S+)')).Groups[1].Value

$loginFile = Join-Path $deploy 'ADMIN-LOGIN.txt'
if (-not (Test-Path $loginFile)) {
    $password = New-Secret 24 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'
    [IO.File]::WriteAllText($loginFile, "Admin panel: $siteUrl/$adminPath`r`nEmail: $adminEmail`r`nPassword: $password`r`n`r`nChange the password after the first login (your initials, top right > Profile), then delete this file.`r`n", $utf8)
}
$adminPassword = ([regex]::Match([IO.File]::ReadAllText($loginFile), '(?m)^Password: (\S+)')).Groups[1].Value

# 2. The public site as plain files
Write-Host 'Building the site...'
$env:NEXT_OUTPUT = 'export'
$env:NEXT_PUBLIC_SITE_URL = $siteUrl
Push-Location (Join-Path $root 'frontend')
try {
    if (Test-Path .next) { Remove-Item .next -Recurse -Force }
    if (Test-Path out) { Remove-Item out -Recurse -Force }
    Invoke-Checked { npm run build } 'The site build'
} finally {
    Pop-Location
    Remove-Item Env:NEXT_OUTPUT, Env:NEXT_PUBLIC_SITE_URL
}

# 3. Clean folders to put together
foreach ($folder in $stage, $upload) { if (Test-Path $folder) { Remove-Item $folder -Recurse -Force } }
New-Item -ItemType Directory -Force $front, $back, $upload | Out-Null

# 4. frontend/ and the .htaccess that joins the two folders
Copy-Item (Join-Path $root 'frontend/out/*') $front -Recurse
# The admin panel's logos, unless the site already has a file of the same name
Get-ChildItem (Join-Path $root 'backend/public/images') | Where-Object { -not (Test-Path (Join-Path $front "images/$($_.Name)")) } | Copy-Item -Destination (Join-Path $front 'images')
[IO.File]::WriteAllText((Join-Path $web '.htaccess'), ([IO.File]::ReadAllText((Join-Path $deploy 'public.htaccess')) -replace '__ADMIN_PATH__', [regex]::Escape($adminPath)), $utf8)

# 5. backend/: Laravel, without tests, local settings or uploads from this PC
& robocopy (Join-Path $root 'backend') $back /E /NFL /NDL /NJH /NJS /NP `
    /XD (Join-Path $root 'backend/vendor') (Join-Path $root 'backend/tests') (Join-Path $root 'backend/storage') (Join-Path $root 'backend/node_modules') (Join-Path $root 'backend/public/storage') `
    /XF .env .env.example .env.production.example .phpunit.result.cache phpunit.xml hot | Out-Null
if ($LASTEXITCODE -ge 8) { throw "Copying Laravel failed with robocopy code $LASTEXITCODE" }
# Caches from this PC list development packages and Windows paths. Laravel and composer make new ones.
Get-ChildItem (Join-Path $back 'bootstrap/cache') -Filter *.php | Remove-Item
# Laravel's own public/.htaccess, plus the rule that keeps /backend/... addresses closed
Copy-Item (Join-Path $deploy 'backend-public.htaccess') (Join-Path $back 'public/.htaccess') -Force
foreach ($dir in 'app/private', 'app/public', 'framework/cache/data', 'framework/sessions', 'framework/views', 'logs') {
    New-Item -ItemType Directory -Force (Join-Path $back "storage/$dir") | Out-Null
    [IO.File]::WriteAllText((Join-Path $back "storage/$dir/.gitignore"), "*`n!.gitignore`n", $utf8)
}
# Uploads are written straight into public/storage (PUBLIC_DISK_IN_WEB_ROOT), where nothing may run as code
New-Item -ItemType Directory -Force (Join-Path $back 'public/storage/projects') | Out-Null
Copy-Item (Join-Path $root 'backend/storage/app/public/.htaccess') (Join-Path $back 'public/storage')

Write-Host 'Installing Laravel packages for production...'
# Composer runs artisan once it is done, which needs settings, so the live ones are lent for the install
Copy-Item $envFile (Join-Path $back '.env')
try {
    Invoke-Checked { & $php (Join-Path $root 'tools/composer.phar') install --no-dev --optimize-autoloader --no-interaction --no-progress --working-dir=$back } 'composer install'
} finally {
    Remove-Item (Join-Path $back '.env')
}
Copy-Item $envFile (Join-Path $upload '.env')

# 6. The database: tables and the first admin account, made in a throwaway local database
Write-Host 'Preparing the database file...'
$buildDb = 'coderoot_live_build'
$buildUser = 'coderoot_build'
$buildPassword = New-Secret 24 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'
Invoke-Checked { & $mysql -u root -e "DROP DATABASE IF EXISTS $buildDb; CREATE DATABASE $buildDb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci; DROP USER IF EXISTS '$buildUser'@'localhost'; CREATE USER '$buildUser'@'localhost' IDENTIFIED BY '$buildPassword'; GRANT ALL ON $buildDb.* TO '$buildUser'@'localhost';" } 'Creating the build database'
$env:DB_HOST = 'localhost'; $env:DB_DATABASE = $buildDb; $env:DB_USERNAME = $buildUser; $env:DB_PASSWORD = $buildPassword
$env:ADMIN_EMAIL = $adminEmail; $env:ADMIN_PASSWORD = $adminPassword
Push-Location (Join-Path $root 'backend')
try {
    Invoke-Checked { & $php artisan migrate --force --seed --no-interaction } 'Creating the tables'
} finally {
    Pop-Location
    Remove-Item Env:DB_HOST, Env:DB_DATABASE, Env:DB_USERNAME, Env:DB_PASSWORD, Env:ADMIN_EMAIL, Env:ADMIN_PASSWORD
}
Invoke-Checked { & $mysqldump -u root --skip-comments --single-transaction --no-tablespaces "--result-file=$sql" $buildDb } 'Exporting the database'
Invoke-Checked { & $mysql -u root -e "DROP DATABASE $buildDb; DROP USER '$buildUser'@'localhost';" } 'Removing the build database'
# Newer MariaDB dumps start with a line MySQL cannot read
$dump = [IO.File]::ReadAllLines($sql) | Where-Object { $_ -notmatch '^/\*M!999999' }
[IO.File]::WriteAllLines($sql, [string[]]$dump, $utf8)

# 7. The zip of the domain folder's contents, with forward slashes so cPanel extracts it correctly.
# Windows' own tar, because the one Git Bash puts first on the PATH cannot write zip files.
if (Test-Path $zip) { Remove-Item $zip }
Invoke-Checked { & "$env:SystemRoot\System32\tar.exe" -a -c -f $zip -C $web .htaccess frontend backend } 'Making the zip'
Write-Host ('Done: {0} ({1:N1} MB)' -f $zip, ((Get-Item $zip).Length / 1MB))
Write-Host "Upload on their own: $upload"
Write-Host "Admin login details: $loginFile"
