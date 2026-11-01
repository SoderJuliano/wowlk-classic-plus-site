# WoW Classic Plus LK — official website

*The Classic Experience, Evolved.*

Vue 3 + Vue Router + Vite. No UI framework, no backend in this repo — about 65 KB of gzipped
JS, and the hero art is an original inline SVG (no image downloads).

## Run

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # Vitest — SRP6, validation, honeypot, payloads, register flow
npm run build      # → dist/ (static; serve with SPA fallback to index.html)
npm run preview
```

Hosting: any static host (Netlify, Vercel, Nginx). Configure the SPA fallback so
`/register`, `/verify-email`, etc. resolve to `index.html`
(Netlify: `/* /index.html 200`; Nginx: `try_files $uri /index.html;`).

## Configuration

Everything lives in **`src/config/site.js`**, and any value can be overridden through
`VITE_*` variables in `.env` (git-ignored; template in `.env.example`).

**Queue keys are required** (`VITE_QUEUE_REGISTRATION_KEY`, `VITE_QUEUE_EVENTS_KEY`): they are not in the
source code and `npm run build` fails if they are missing. Important: Vite *inlines* every `VITE_*`
value into the JS in `dist/`, so the keys are readable by anyone who opens the deployed site —
that is unavoidable for anything the browser uses. Protect the data with `VITE_QUEUE_PUBLIC_KEY`
(encryption) and validate everything in the worker.

Gameplay videos (YouTube IDs) are in `site.videos`; they load only when the visitor clicks play.

| What | Variable |
|---|---|
| Site URL (used in e-mail links) | `VITE_SITE_URL` |
| Realm name / status / live status endpoint | `VITE_REALM_NAME`, `VITE_REALM_STATUS`, `VITE_STATUS_URL` |
| Realmlist, region, measured latency ("Play Now") | `VITE_REALMLIST`, `VITE_REALM_REGION`, `VITE_REALM_LATENCY_MS` |
| Support page | `VITE_SUPPORT_URL` |
| Download status + URLs (32/64-bit) | `VITE_DOWNLOAD_32_STATUS`, `VITE_DOWNLOAD_64_STATUS`, `…_URL` |
| Launcher status + URL | `VITE_LAUNCHER_STATUS`, `VITE_LAUNCHER_URL` |
| Queue keys / encryption | `VITE_QUEUE_REGISTRATION_KEY`, `VITE_QUEUE_EVENTS_KEY`, `VITE_QUEUE_PUBLIC_KEY` |
| Login backend (optional) | `VITE_AUTH_API_URL` |

Statuses: `coming-soon` | `early-access` | `available`. A download/launcher button only links
somewhere when its status is not `coming-soon` **and** a URL is set; otherwise it opens the
"downloads are being prepared" dialog (with an e-mail notification opt-in). No fake links.

Feature stages (Live / In development / Experimental / Planned), the 64-bit platforms and the
FSR/DLSS list are also in `site.js` — update them as the project moves.

Realm status: without `VITE_STATUS_URL` the site shows the configured state and `—` for
players/accounts with a "pre-launch, no numbers are simulated" note. With it, it fetches
`{ online, playersOnline, totalAccounts }` every 60 s.

## Accounts — how it works

```
Register form ─▶ honeypot + fill-time check (no request if it trips)
              ─▶ validation ─▶ SRP6 salt/verifier computed in the browser
              ─▶ POST Abra API /notifications  key = wow-classic-plus-lk
Game server worker polls the key ─▶ creates the AzerothCore account (locked)
              ─▶ e-mails a server-generated verification link
/verify-email?u=…&t=… ─▶ user clicks "Confirm" ─▶ event queued ─▶ worker validates & unlocks
```

- The plain password never leaves the browser; the message carries the same SRP6
  `salt`/`verifier` AzerothCore stores (no BCrypt, no incompatible hash).
- Verification and reset tokens are generated, hashed, expired and single-used by the
  **server worker** — the browser only relays what the user received. This is what makes
  the e-mail verification real.
- Full message format, SQL, token table, abuse rules and decryption code:
  **[`docs/QUEUE_CONTRACT.md`](docs/QUEUE_CONTRACT.md)**.
- Branded HTML e-mails for the worker: `scripts/email-templates.mjs`.

### Strongly recommended before going live

1. `npm run queue:keygen` → set `VITE_QUEUE_PUBLIC_KEY`, keep `queue-private-key.pem` on the
   server only. Without it, anyone who reads the bundle can list queued e-mails and verifiers.
2. Server-side rate limiting/validation in the worker (and ideally on Abra API itself).
3. Review `/terms` and `/privacy` (they are drafts).

### Login

A queue can't answer "is this password right?" synchronously, so the login page is fully
built but tells users the portal opens at launch. Set `VITE_AUTH_API_URL` to a backend
exposing `POST /auth/login` (httpOnly session cookie, rate-limited, SRP6 check against
`acore_auth`) and it starts working.

## Structure

```
src/config/site.js          central configuration
src/services/               abraApi, accountService, srp6, queueCrypto, statusService
src/utils/                  validation, botGuard (honeypot), linkParams
src/components/home/        landing sections (hero, status, about, features, 64-bit, visuals, launcher, downloads, support, community)
src/components/ui/          logo, icons, Northrend scene, badges, download dialog, honeypot
src/components/auth/        auth layout + text field
src/views/                  pages
docs/QUEUE_CONTRACT.md      contract for the game-server worker
scripts/                    queue key generator, e-mail templates
tests/                      Vitest suites
```

## Assets & legal

The logo, emblem, Northrend illustration and UI icons are original. Platform marks come
from Simple Icons (CC0) / the Windows mark is redrawn. Fonts: Cinzel, Cinzel Decorative,
Inter (Google Fonts, OFL). The site carries the non-affiliation notice with Blizzard
Entertainment in the footer.
