@echo off
rem Starts the whole site on this PC. Close the two windows to stop it.
set PHP=C:\xampp\php\php.exe
set ROOT=%~dp0

tasklist /FI "IMAGENAME eq mysqld.exe" | find /I "mysqld.exe" >nul
if errorlevel 1 (
    echo Starting MySQL from XAMPP...
    start "CodeRoot MySQL" /min C:\xampp\mysql\bin\mysqld.exe --defaults-file=C:\xampp\mysql\bin\my.ini --standalone
    timeout /t 5 /nobreak >nul
)

start "CodeRoot API (Laravel)" cmd /k "cd /d %ROOT%backend && %PHP% artisan serve --host=127.0.0.1 --port=8000"
start "CodeRoot Site (Next.js)" cmd /k "cd /d %ROOT%frontend && npm run dev -- --hostname 127.0.0.1 --port 3000"

echo.
echo   Website:     http://127.0.0.1:3000
echo   Admin panel: http://127.0.0.1:8000/admin
echo.
