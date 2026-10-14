# PIMX WIDE v2

The existing React/Vite app includes the landing experience, a unified text/file/folder studio, an encrypted device vault, password/passphrase generation, portable packages and QR, optional server-limited links, preferences, quick lock, an offline app shell and authenticated analytics. The interface supports Persian, English, Russian, Chinese, German, French, Japanese and Korean. Legacy AES-GCM packages can still be decrypted. Passphrases select at least six English words from the 7,776-word EFF Long Wordlist with browser cryptographic randomness; see THIRD_PARTY.md for attribution.

## Local application

The visual layer uses Motion for route, tab, list and notification transitions, plus interactive CSS 3D sculptures. Select menus are styled listboxes with keyboard navigation, type-ahead, escape, outside-click handling and dialog-aware placement. Motion respects both the app preference and system reduced motion. 3D scene animations pause outside the viewport and in hidden tabs. Layout QA covers 300, 390, 768, 1440, 2560 and 3840 pixel widths in Persian/English and dark/light themes. Route modules load on demand; the production offline shell precaches every route chunk.

```powershell
npm ci
npm run dev
```

Vite provides all device-local features. Share links and admin analytics require the Pages Functions server below. No API keys are embedded into the client bundle. Runtime fonts and icons are served locally.

## Full local server

```powershell
npm run db:local
npm run dev:full
```

Open `http://localhost:8788`. Browser security allows Web Crypto and service workers on localhost. HTTPS is required on a deployed host. The production build creates the service worker; it is not registered in Vite development mode.

The manifest has PNG icons and uses standalone display. Installation UI depends on the browser. On iOS, use Share → Add to Home Screen. First load the production app completely online, then verify it offline. The service worker caches static assets only, never API responses, passwords or encrypted packages.

## Administrator credentials

The old browser-side password check has been removed. `/pimxwideadmin` requires a server-verified credential and a signed HttpOnly, Secure, SameSite cookie that expires after one hour. Login attempts are rate limited. Generate credentials by sending your password via stdin to `npm run admin:secret` (not as a command argument). The command outputs `ADMIN_PASSWORD_HASH` and `SESSION_SECRET`; treat those as secrets and keep them out of Git.

For local Wrangler, put the two output values into an ignored `.dev.vars` file:

```text
ADMIN_PASSWORD_HASH=<salt:hash from generator>
SESSION_SECRET=<secret from generator>
```

The placeholder D1 UUID appears only in `wrangler.local.toml` for local emulation. Production `wrangler.toml` intentionally has no D1 binding: link sharing and administrator analytics are unavailable until a database and secrets are configured. The interface explains that links are disabled and keeps downloads and direct QR available. Rotate `SESSION_SECRET` to invalidate existing sessions.

## Existing Cloudflare Pages deployment

1. Create the database: `npx wrangler d1 create pimx-private`.
2. Copy the `[[d1_databases]]` block from `wrangler.local.toml` into `wrangler.toml`, then replace its `database_id` with the real UUID and keep the binding `PIMX_DB`.
3. Apply the schema: `npx wrangler d1 migrations apply PIMX_DB --remote`.
4. Configure `ADMIN_PASSWORD_HASH` and `SESSION_SECRET` as **encrypted secrets**, separately for production and preview in Pages settings.
5. Build with `npm run build` and use `dist` as the Pages output directory. Keep `functions/` in the source deployment.
6. Verify `/api/health`, administrator login and a disposable single-use share on the deployed HTTPS host.

Share creation uploads only a validated v2 encrypted package (maximum 500 KB). Passwords travel separately. Tokens contain 192 random bits and use URL fragments, which are not sent with page navigation. Retrieval is an explicit POST; link previews do not consume it. An atomic D1 UPDATE decrements remaining downloads. Limits: 1/3/5/10 downloads, 1 hour/24 hours/7 days. A failed connection after a successful server retrieval may still use a download. Download limits cannot erase received copies.

Visit analytics are disabled by default. With consent, the database stores time, country and broad device category, never plaintext, passwords or raw IP addresses. The admin API is authenticated. Trend grouping uses Tehran time. The rate limiter temporarily stores bucket-scoped hashed IP identifiers. Visits older than 90 days and expired rate buckets are cleaned on a new analytics request. Expired/consumed share rows are cleaned on share creation and analytics writes; expired rows are never served even if no cleanup has run. Configure a scheduled database maintenance job if timely physical deletion is required.

## Limits and data handling

- Studio input limits: 48 MB on desktop, 24 MB on mobile, up to 100 files. Filenames and folder paths are preserved inside an encrypted ZIP. Processing occurs in a Worker and cancellation terminates that Worker. ZIP packaging uses no compression to bound memory costs.
- The v2 envelope uses AES-256-GCM, PBKDF2-SHA256 (600,000 iterations), a fresh 16-byte salt and 12-byte IV. Version, algorithm, KDF, iterations and kind are authenticated. No password is included in exports. Legacy v1 uses the original 100,000 iterations.
- The device vault encrypts the complete collection including titles and tags under its own password. Individual packages retain their own passwords. The vault has a 64 MB plaintext envelope limit; base64 overhead means fewer large packages fit. Storage quota depends on the device. No password recovery exists.
- Locking clears application session state and terminates studio Workers. It does not guarantee browser-memory or clipboard sanitization. Downloaded copies remain. Do not rely on this app to protect a compromised device.
- Backup files are encrypted. Imports merge into an unlocked vault or initialize an empty vault with the backup’s original password. Clearing app data requires explicit confirmation and affects only this app’s vault and settings.
- No independent security audit has been performed. Verify recovery before deleting original data.

## Verification

Language options are available in the header and settings. Persian uses RTL; the other languages use LTR. The selected language survives reloads. UI dictionaries live under `data/locales`; startup screens, installation manifests and SVG artwork are localized during the build. The build fails for missing translations or changed placeholders. Translation drafting is a one-time developer operation (`scripts/translate-catalog.mjs`), never a browser or production-build network request. Review generated copy before committing it.

`/build-info.json` exposes the deployed Git revision. HTML, bootstrap scripts and the service worker revalidate online; offline mode uses the app shell. A replacement service worker activates after precaching succeeds and removes obsolete PIMX caches, without reloading a user's active session.

Manual quick lock (including Ctrl+Shift+L) clears current session state, closes the vault and replaces the current page with `https://www.google.com/`. Automatic inactivity locking keeps the local lock screen. This does not erase browser history, downloaded files, saved encrypted vaults or clipboard contents.

```powershell
npm run typecheck
npm test
npm run build
npm run test:e2e
```

Browser tests require Playwright Chromium (`npx playwright install chromium`). They run against a local Pages server with disposable fixture credentials and a local D1 schema. They never deploy or touch the remote database.

Protocol references: [Web Crypto encryption](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/encrypt), [D1 prepared statements](https://developers.cloudflare.com/d1/worker-api/prepared-statements/), [Pages bindings](https://developers.cloudflare.com/pages/functions/bindings/).
