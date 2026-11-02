/**
 * Account service — the only module views talk to.
 *
 * Transport: Abra API notifications used as a queue (see docs/QUEUE_CONTRACT.md).
 *  - `account.register` → key `site.abra.registrationKey` (what the game server polls)
 *  - everything else    → key `site.abra.eventsKey`
 *
 * Security model:
 *  - On sign-up the plain password never leaves the browser; only AzerothCore SRP6 salt/verifier.
 *  - The account is created active by the server worker (Pikachu), within about 2 minutes.
 *  - Password recovery sends only new SRP6 values; the server checks username + e-mail.
 *  - Login goes straight to the Pikachu API over HTTPS (see login below); services/session.js keeps the session.
 */
import { site } from '../config/site.js'
import { publish } from './abraApi.js'
import { sealPayload } from './queueCrypto.js'
import { makeRegistrationData } from './srp6.js'
import { normalizeEmail, normalizeUsername } from '../utils/validation.js'

export const SCHEMA_VERSION = 1

const uuid = () =>
  crypto.randomUUID?.() ??
  Array.from(crypto.getRandomValues(new Uint8Array(16)), (b) => b.toString(16).padStart(2, '0')).join('')

function envelope(type, data) {
  return {
    schema: SCHEMA_VERSION,
    type,
    id: uuid(),
    createdAt: new Date().toISOString(),
    source: `${site.slug}-site`,
    siteUrl: site.url,
    ...data
  }
}

async function send(key, payload) {
  if (!key) throw new Error('Queue key missing — set VITE_QUEUE_REGISTRATION_KEY / VITE_QUEUE_EVENTS_KEY in .env before building.')
  const content = await sealPayload(payload, site.abra.publicKey)
  await publish(key, payload.type, content)
  return { id: payload.id }
}

/** Queue a new game account. Uniqueness is enforced by the server against the auth DB. */
export async function registerAccount({ username, email, password, notifyDownloads = true, locale }) {
  const accountName = normalizeUsername(username)
  const srp6 = await makeRegistrationData(accountName, password)
  const payload = envelope('account.register', {
    account: {
      username: accountName,
      email: normalizeEmail(email),
      salt: srp6.salt, //           hex, 32 bytes LE → account.salt
      verifier: srp6.verifier, //   hex, 32 bytes LE → account.verifier
      expansion: 2, //              WotLK
      locale: locale ?? (typeof navigator !== 'undefined' ? navigator.language : 'en')
    },
    preferences: { notifyDownloads: Boolean(notifyDownloads) },
    consent: { termsVersion: site.auth.termsVersion, acceptedAt: new Date().toISOString() }
  })
  return send(site.abra.registrationKey, payload)
}

/**
 * New SRP6 credentials for an account, proven by username + account e-mail. The server applies them
 * only if both match, and the site never learns whether they did (no account enumeration).
 */
export async function recoverPassword({ username, email, password }) {
  const accountName = normalizeUsername(username)
  const srp6 = await makeRegistrationData(accountName, password)
  return send(
    site.abra.eventsKey,
    envelope('password.recover', {
      account: {
        username: accountName,
        email: normalizeEmail(email),
        salt: srp6.salt,
        verifier: srp6.verifier,
        locale: typeof navigator !== 'undefined' ? navigator.language : 'en'
      }
    })
  )
}

export function subscribeToDownloads({ email }) {
  return send(site.abra.eventsKey, envelope('downloads.subscribe', { email: normalizeEmail(email) }))
}

export const isLoginAvailable = () => Boolean(site.auth.apiUrl)

/**
 * Login requires a synchronous answer, which a queue cannot give, so it calls the Pikachu API
 * directly: POST {VITE_AUTH_API_URL}/auth/login. The API returns tokens in the body and uses
 * no cookies, so the request is sent without credentials.
 */
export async function login({ login: identifier, password }) {
  if (!isLoginAvailable()) throw loginError('LOGIN_UNAVAILABLE', 'Account login is not available yet.')

  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), 15_000)
  let res
  let body = null
  try {
    res = await fetch(`${site.auth.apiUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // The API is behind a free ngrok tunnel: without this, browsers get its HTML warning page.
        'ngrok-skip-browser-warning': 'true'
      },
      body: JSON.stringify({ login: identifier.trim(), password }),
      signal: ctrl.signal
    })
    body = await res.json().catch(() => null)
  } catch {
    throw loginError('LOGIN_UNREACHABLE', UNREACHABLE)
  } finally {
    clearTimeout(timer)
  }

  if (res.ok) {
    // A 200 without tokens is not a login (e.g. an HTML page from the tunnel).
    if (!body?.access_token || !body?.user?.username) throw loginError('LOGIN_UNREACHABLE', UNREACHABLE)
    return body
  }
  const code = body?.error?.code
  if (res.status === 401) throw loginError('INVALID_CREDENTIALS', 'Invalid username/e-mail or password.')
  if (res.status === 429) throw loginError('RATE_LIMITED', 'Too many attempts. Please wait a few minutes.')
  // Locked or banned: the API's message is written to be shown to the player.
  if (res.status === 403) throw loginError(code ?? 'ACCOUNT_LOCKED', body?.error?.message ?? 'This account cannot log in.')
  throw loginError(code ?? 'LOGIN_UNREACHABLE', UNREACHABLE)
}

const UNREACHABLE = 'We could not reach the account service. Please try again in a few minutes.'
const loginError = (code, message) => Object.assign(new Error(message), { code })
