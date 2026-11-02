# Queue contract — site ⇄ game server

The site has no backend of its own. It publishes messages to **Abra API notifications**
(used as a queue). A worker on the game server polls them, talks to the AzerothCore
`acore_auth` database **locally** (MySQL is never exposed) and sends e-mails.

```
Browser ──POST /notifications──▶ Abra API ◀──GET /notifications/retrieve?key=…── Server worker ──▶ acore_auth
                                                         └── POST /email/send-email/html ◀──┘
```

## Keys

| Key (`.env`: `VITE_QUEUE_*_KEY`) | Content                                                       |
|---------------------------------|---------------------------------------------------------------|
| `VITE_QUEUE_REGISTRATION_KEY`   | `account.register` only — the account-creation array          |
| `VITE_QUEUE_EVENTS_KEY`         | `password.reset.request`, `password.reset`, `downloads.subscribe` |

## Polling

```bash
curl "https://abra-api.top/notifications/retrieve?key=<REGISTRATION_KEY>"
# → 200 [ { "id": "...", "title": "account.register", "key": "...", "content": "<string>", "dateCreated": "..." } ]
# → 404 when the key has no messages
```

After processing a message **delete it** (idempotency: also store the payload `id` you processed):

```bash
curl -X DELETE https://abra-api.top/notifications/delete \
  -H "Content-Type: application/json" -d '{"id":"<notification id>","key":"<REGISTRATION_KEY>"}'
```

`content` is the JSON payload as a string — or, when `VITE_QUEUE_PUBLIC_KEY` is set, an
encrypted envelope (see bottom).

## Common envelope

```json
{ "schema": 1, "type": "account.register", "id": "uuid", "createdAt": "ISO-8601",
  "source": "wow-classic-plus-lk-site", "siteUrl": "https://…" }
```

## `account.register`  (key `wow-classic-plus-lk`)

```json
{
  "schema": 1, "type": "account.register", "id": "…", "createdAt": "…", "source": "…", "siteUrl": "…",
  "account": {
    "username": "ARTHAS",
    "email": "arthas@lordaeron.com",
    "salt": "64 hex chars",
    "verifier": "64 hex chars",
    "expansion": 2,
    "locale": "pt-BR"
  },
  "preferences": { "notifyDownloads": true },
  "consent": { "termsVersion": "2026-10-31", "acceptedAt": "…" }
}
```

**There is no password in the message.** `salt`/`verifier` are AzerothCore SRP6 values
(32 bytes, little-endian, exactly what `account.salt` / `account.verifier` store),
computed in the browser from `UPPER(username):UPPER(password)`. Verified in the test
suite against an independent implementation of `SRP6.cpp`.

Worker (Pikachu, module `wowlk`, polls every 2 minutes):

1. Re-validates everything (never trust the browser): username `^[A-Z0-9]{3,16}$`, e-mail
   format/length, hex lengths, `expansion` = 2. Invalid → apology e-mail, message removed.
2. Uniqueness: username or e-mail in use → e-mail saying so (does not leak which), message removed.
3. Creates the account **active**, as a regular player (no `account_access` row):

   ```sql
   INSERT INTO account (username, salt, verifier, email, reg_mail, expansion, locked, joindate)
   VALUES (?, ?, ?, ?, ?, 2, 0, NOW());
   ```

4. Sends a plain-text "account activated" e-mail through
   `POST https://abra-api.top/email/send-email/{email}/{message}/{subject}` and deletes the message by id.
5. Temporary errors keep the message queued for the next cycle; on the 3rd failure the player
   gets an apology e-mail and the message is removed.

There is no e-mail verification step: a player can log in about 2 minutes after registering.

> **Not processed yet:** events in the `-events` key (below) are only counted in Pikachu's log.

## `password.reset.request`

`{ "email": "…" }` → if the account exists, create a `reset` token (e.g. 60 min), stored only as a
SHA-256 hash with its expiry, and send `passwordResetEmail()`. Same silent behaviour if it doesn't.

## `password.reset`

`{ "username": "ARTHAS", "token": "…", "salt": "hex", "verifier": "hex" }` → validate the
`reset` token as above, mark it used, invalidate other reset tokens for the account, then
`UPDATE account SET salt = UNHEX(?), verifier = UNHEX(?) WHERE id = ?`.

## `downloads.subscribe`

`{ "email": "…" }` → store (deduplicated) in the site schema. When downloads ship, send
`downloadsReadyEmail()` to these addresses and to accounts with `notifyDownloads: true`.

## Abuse protection (server side — mandatory)

The honeypot and minimum fill-time in the browser only stop naive bots; anybody can post to
the queue directly. The worker must therefore:

- re-validate every field and drop malformed messages;
- cap registrations per e-mail domain / per time window and globally per minute;
- limit reset e-mails per address;
- if the queue gets flooded, move registration behind your own endpoint with per-IP rate
  limiting and an adaptive CAPTCHA (e.g. Cloudflare Turnstile shown only when traffic is
  suspicious). Ideally Abra API itself gets per-IP rate limiting on `POST /notifications`.

## Encryption (recommended)

Anyone who knows a key can read that queue, and the keys ship inside the site bundle. Run
`npm run queue:keygen`, put the public key in `VITE_QUEUE_PUBLIC_KEY` and keep
`queue-private-key.pem` on the game server. Encrypted `content`:

```json
{ "enc": "RSA-OAEP-256+A256GCM", "key": "b64", "iv": "b64", "data": "b64" }
```

Node decryption:

```js
import { privateDecrypt, createDecipheriv, constants } from 'node:crypto'
import { readFileSync } from 'node:fs'
const pem = readFileSync('queue-private-key.pem')
export function open(content) {
  const m = JSON.parse(content)
  if (!m.enc) return m
  const key = privateDecrypt({ key: pem, padding: constants.RSA_PKCS1_OAEP_PADDING, oaepHash: 'sha256' }, Buffer.from(m.key, 'base64'))
  const buf = Buffer.from(m.data, 'base64')
  const d = createDecipheriv('aes-256-gcm', key, Buffer.from(m.iv, 'base64'))
  d.setAuthTag(buf.subarray(-16))
  return JSON.parse(Buffer.concat([d.update(buf.subarray(0, -16)), d.final()]).toString('utf8'))
}
```
