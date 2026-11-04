# CodeRoot Solutions website

The company website at coderootsolutions.com.

| Part | Folder | Stack |
| --- | --- | --- |
| Public site | `frontend/` | Next.js 16, Tailwind CSS 4, hand-written WebGL |
| API and admin panel | `backend/` | Laravel 12, Filament 5 |
| Database | | MySQL (MariaDB locally through XAMPP) |

The live site is plain files built by Next.js (`NEXT_OUTPUT=export`), served from the same domain as Laravel on ordinary PHP hosting. Browsers read projects from the Laravel API at `/api/v1`, and Laravel serves each `/projects/<slug>` page with that project's title and share image in the head, so a new project shows up without building the site again.

## Run it on this PC

Double-click `dev.bat`, or start each part yourself:

```bash
C:/xampp/php/php.exe backend/artisan serve --host=127.0.0.1 --port=8000
```

```bash
npm --prefix frontend run dev -- --hostname 127.0.0.1 --port 3000
```

- Website: http://127.0.0.1:3000
- Admin panel: http://127.0.0.1:8000/admin

The local admin email and password are `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `backend/.env`. That file is never committed.

Composer is not installed globally on this PC. Use `tools/composer.phar`, for example `C:/xampp/php/php.exe tools/composer.phar install` from inside `backend/`.

## Add a project

1. Log in to the admin panel and open **Projects > New project**.
2. Fill in the details and add a cover image (JPG, PNG or WebP, up to 5 MB).
3. Turn on **Published** and save.

The site updates right away. Drag rows in the list to change the order. **Featured** projects come first.

To change your password or turn on two-factor login (recommended), click your initials in the top right, then **Profile**.

## Change the site's content

- Company details: `frontend/src/lib/site.ts`
- Services, FAQs and SEO text: `frontend/src/lib/services.ts`
- Page titles, descriptions and search keywords: the `pageMetadata({...})` at the top of each page, the home page's in `frontend/src/app/layout.tsx` and `siteKeywords` in `frontend/src/lib/site.ts`. Google cuts titles off at about 580 pixels, so keep a page's own title to about 36 characters (the site adds " | CodeRoot Solutions") and descriptions between 120 and 160 characters.
- Link texts: SEO checkers warn when one page has the same link text twice, so the footer (`footerLinks` in `frontend/src/lib/site.ts`) and the quote buttons use different words from the header menu. Keep it that way when adding links.
- Page sections: `frontend/src/components/home/`
- How we work, values and navigation: `frontend/src/lib/site.ts`
- Pricing page: `frontend/src/lib/pricing.ts`. Set each package's `price` as a plain number, such as `45000`. While it is `null` the page shows [TBC], so set them all before going live. The website prices are the ones the owner chose from sourcecode.lk.
- Technology page: `frontend/src/lib/technology.ts`. Add any other tools you really use here. The moving logo rows on the home page are `techBandRows` in the same file, and each logo is in `frontend/public/images/tech-logos.svg`.
- Who we help: `frontend/src/lib/industries.ts`
- FAQ page: `frontend/src/lib/faqs.ts`
- Insights articles: `frontend/src/lib/insights.ts`. A new article also needs a small route folder under `frontend/src/app/insights/`, copied from an existing one.
- Preloader timing: the values at the top of `frontend/src/components/site/Preloader.tsx`
- 3D shapes: `frontend/src/lib/roots/shapes.ts`. A page picks its shape with the `shapes` prop on `PageHero`.

If a style change does not show up, delete `frontend/.next` and build again. Turbopack's cache kept an old stylesheet once during development.

Brand rule from the guidelines: never invent prices, dates or client details. The site starts with no sample projects for this reason.

## Contact and quote forms

**Send by email** posts the form to Laravel (`POST /api/v1/enquiries`), which emails it to `MAIL_ENQUIRIES_TO` (info@coderootsolutions.com) with Reply-To set to the customer, so you can just press reply. Nothing is saved in the database. **Send on WhatsApp** still opens WhatsApp with the message ready.

The deploy workflow writes the mail settings itself (Spacemail SMTP, `mail.spacemail.com`, port 465) and takes the mailbox password from the `MAIL_PASSWORD` GitHub secret. If you change the password of info@coderootsolutions.com, update that secret and run the deploy again. Locally `MAIL_MAILER=log`, so enquiries go to `backend/storage/logs` instead of the inbox. Each IP can send 3 a minute and 20 a day.

## How the speed is protected

- Every page is prerendered, so visitors get static HTML straight away.
- The 3D scenes do not use three.js. They are hand-written WebGL, loaded only after the page is idle: the roots on the home page (`lib/roots/engine.ts`) and the shapes built from code characters (`lib/roots/glyphs.ts`).
- A static drawing of each scene (`RootsPoster`, `GlyphView`) paints with the HTML and stays on screen for browsers without WebGL, for Data Saver users and for very low-memory devices.
- Detail drops automatically by device. Each scene watches its real frame rate, lowers quality if the device struggles, and settles into a still image if it still cannot keep up. It also stops when off screen or when the tab is hidden, and shows a still image for people who prefer reduced motion.
- The preloader only shows on the first page of a visit, for at most 1.4 seconds after it appears, and never for Data Saver, reduced motion or browsers without JavaScript. The page is already there underneath it. To see it again, open the site in a new tab.
- Other animation is CSS with `transform` and `opacity` only, and scroll effects run on the browser's compositor with no JavaScript. Uploaded images are converted to WebP and scaled down to at most 1600 pixels wide.

## Security

**Website**: strict security headers, a Content Security Policy locked to the site's own origin, no third-party scripts, and all database text escaped by React. Pages are static, which rules out per-request CSP nonces, so `'unsafe-inline'` stays on for scripts.

**API**: read-only, published projects only, an explicit list of returned fields, 120 requests a minute per IP.

**Admin panel**:
- Login limited to 5 attempts a minute, with optional two-factor login
- Encrypted sessions, CSRF protection, admin flag not mass-assignable
- Every upload is re-encoded to a clean WebP under a random name, which strips metadata and anything hidden in the file. SVG is refused.
- Project text is plain text, never HTML. Links must be http or https.

**Database**: a dedicated user that can only touch the site's database.

**Server**: every address under `/backend` or `/frontend` returns 404, so Laravel's code and `.env` cannot be read, the admin panel is at a private address instead of `/admin`, hidden files are refused, and nothing in the uploads folder can run as code.

## Deploy

The site runs on the cPanel hosting (LiteSpeed, PHP) with no Node.js. It needs PHP 8.2+ with `gd`, `intl`, `pdo_mysql`, `mbstring`, `fileinfo` and OPcache, and MySQL 8 or MariaDB 10.4+.

### Make the zip (first install by hand)

```bash
powershell -ExecutionPolicy Bypass -File deploy/build-zip.ps1
```

Everything lives in the domain's folder, `/home/zmpzynrsph/coderootsolutions.com`:

```
coderootsolutions.com/
├── .htaccess    sends each address to the right folder
├── frontend/    the public site, built by Next.js
└── backend/     Laravel (only its public/index.php and assets are ever reached)
```

The script writes:

| File | What to do with it |
| --- | --- |
| `deploy/dist/coderoot-live.zip` | Extract inside `coderootsolutions.com`. It holds no passwords. |
| `deploy/dist/upload/.env` | Upload into `coderootsolutions.com/backend/` on its own. |
| `deploy/dist/upload/coderoot-database.sql` | Import in phpMyAdmin, first install only. Never upload it to the site. |

The live settings, including the database password, are in `deploy/.env.live`. The admin address and first password are in `deploy/ADMIN-LOGIN.txt`. Neither file may be shared. The script keeps the same app key and admin address on every build. Empty `APP_KEY` or `ADMIN_PATH` in `.env.live`, or delete `ADMIN-LOGIN.txt`, to get new ones.

### First install

1. **cPanel > MySQL Databases**: the live database is `zmpzynrsph_coderootadmin`, with the user `zmpzynrsph_coderootadmin` given **All Privileges** on it. If you use a different name, change `DB_DATABASE` in the `LARAVEL_ENV` secret and in `deploy/.env.live`.
2. **phpMyAdmin**: open that database, then **Import** `coderoot-database.sql` from this PC.
3. **cPanel > Select PHP Version** (or MultiPHP Manager): choose PHP 8.2 or newer, with `intl`, `gd`, `pdo_mysql`, `mbstring`, `fileinfo` and `opcache` turned on.
4. **File Manager**: open `coderootsolutions.com`, upload `coderoot-live.zip` there, **Extract** it, then delete the zip straight away.
5. Upload `.env` into `coderootsolutions.com/backend/`. Turn on **Settings > Show Hidden Files** to see it.
6. Turn on **SSL/TLS Status > AutoSSL** for the domain if it is not on, and open the site and the admin panel. Change the admin password under **Profile** after the first login.

### Updates: push to GitHub

Every push to `main` runs `.github/workflows/deploy.yml`. It builds the site, installs Laravel's packages, writes `backend/.env` from the secrets, and uploads the domain folder by FTP over TLS. It can also be started by hand from the repository's **Actions** tab (**Deploy > Run workflow**). Only changed files are uploaded, and only files the workflow uploaded before are ever deleted, so uploaded images and logs stay.

The repository is public, so settings live in **Settings > Secrets and variables > Actions**:

| Secret | What it holds |
| --- | --- |
| `FTP_SERVER` | `server905.shared.spaceship.host`. The server's own name, because the TLS certificate is issued for it, not for `ftp.coderootsolutions.com`. |
| `FTP_USERNAME` | `coderoot@coderootsolutions.com`, an FTP account whose folder is `coderootsolutions.com` |
| `FTP_PASSWORD` | That FTP account's password |
| `LARAVEL_ENV` | The whole backend `.env`, without the `DB_PASSWORD` line. The admin address is read from its `ADMIN_PATH`. |
| `DB_PASSWORD` | The database user's password. After changing it in **cPanel > MySQL Databases**, update this secret and run the workflow again. |

Never commit `.env` files, `deploy/.env.live` or `deploy/ADMIN-LOGIN.txt`. `.gitignore` keeps them out.

The workflow never uploads `backend/vendor`, Laravel's 14,000 package files, because the server takes several seconds per FTP command. They come from the first-install zip. After a change to `backend/composer.lock`, run `deploy/build-zip.ps1`, delete `backend/vendor` on the server, and upload and extract just that folder from the new zip.

The workflow does not touch the database. A change that needs a new table or column also needs that change made in phpMyAdmin. Never import the SQL file again, as it would wipe the projects.

### How the folders share the domain

`deploy/public.htaccess` sends `/<admin path>`, `/api`, `/livewire-*`, `/filament`, `/projects/<slug>` and `/projects-sitemap.xml` to `backend/public/index.php`, the admin panel's `/css`, `/js` and `/fonts` to `backend/public`, uploads at `/media` to `backend/public/storage`, and everything else to `frontend`. It also forces HTTPS, drops `www` and trailing slashes, returns 404 for any address that starts with `/frontend` or `/backend`, and sets the security headers for the plain files. Laravel's `SecurityHeaders` middleware sets them for its own responses. `FRONTEND_BUILD_PATH=../frontend` tells Laravel where the built pages are, and with `PUBLIC_DISK_IN_WEB_ROOT=true` uploads go straight into `backend/public/storage`, because shared hosting cannot be relied on for `storage:link`.

After launch, add the site to Google Search Console and submit `https://coderootsolutions.com/sitemap.xml` and `https://coderootsolutions.com/projects-sitemap.xml`.

## Tests

```bash
C:/xampp/php/php.exe backend/artisan test
```

```bash
npm --prefix frontend run lint
```
