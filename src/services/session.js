/**
 * Web login session. Keeps only what the header needs: the username and the refresh token
 * (never the password). `session` is reactive, so the UI follows login and logout.
 *
 * The API rotates the refresh token on every use, so a stale copy stops working. All refreshes
 * reread localStorage inside a lock, and tabs stay in sync through the `storage` event.
 */
import { ref } from 'vue'
import { site } from '../config/site.js'
import { ensureBackendReady } from './backendDiscovery.js'

const KEY = 'wowlk.session'
const RECHECK_MS = 5 * 60_000

export const session = ref(read())

/** Short-lived access token, kept in memory only (never in localStorage). */
let access = null

function read() {
  try {
    const s = JSON.parse(localStorage.getItem(KEY))
    return s?.username && s?.refreshToken && s.refreshExpiresAt > Date.now() ? s : null
  } catch {
    return null
  }
}

function write(value) {
  session.value = value
  try {
    if (value) localStorage.setItem(KEY, JSON.stringify(value))
    else localStorage.removeItem(KEY)
  } catch { /* private mode: the session lasts until the page closes */ }
}

function fromTokens(body) {
  access = body.access_token
    ? { token: body.access_token, expiresAt: Date.now() + Number(body.expires_in || 0) * 1000 }
    : null
  return {
    username: body.user.username,
    refreshToken: body.refresh_token,
    refreshExpiresAt: Date.now() + Number(body.refresh_expires_in) * 1000,
    checkedAt: Date.now()
  }
}

export function startSession(tokens) {
  write(fromTokens(tokens))
}

/**
 * Consumes `#sso=<refresh_token>` passed by the desktop launcher when opening the site.
 * Removes the hash from the URL immediately and exchanges the token for a web session.
 */
export async function consumeSsoHash() {
  if (typeof window === 'undefined') return false
  const hash = window.location.hash || ''
  const match = hash.match(/^#sso=([A-Za-z0-9._~-]+)$/)
  if (!match) return false
  const token = decodeURIComponent(match[1])
  try {
    window.history.replaceState(null, '', window.location.pathname + window.location.search)
  } catch { /* ignore */ }
  return withLock(async () => {
    try {
      const res = await post('/auth/refresh', { refresh_token: token })
      if (res.ok) {
        write(fromTokens(await res.json()))
        return true
      }
    } catch { /* offline or expired */ }
    return false
  })
}

async function post(path, body) {
  await ensureBackendReady()
  if (!site.auth.apiUrl) return Promise.reject(new Error('Auth API unavailable'))
  return fetch(`${site.auth.apiUrl}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(15_000)
  })
}

const withLock = (fn) => (navigator.locks ? navigator.locks.request(KEY, fn) : fn())

/**
 * On page load: ends the session if the server revoked it (password changed, ban, logout elsewhere).
 * A network failure says nothing about the session, so it is kept.
 */
export function revalidateSession() {
  if (!session.value || !site.auth.apiUrl) return Promise.resolve()
  return withLock(async () => {
    const current = read()
    session.value = current
    if (!current || Date.now() - current.checkedAt < RECHECK_MS) return
    try {
      const res = await post('/auth/refresh', { refresh_token: current.refreshToken })
      if (res.ok) write(fromTokens(await res.json()))
      else if (res.status === 401 || res.status === 403) write(null)
    } catch { /* offline or tunnel down */ }
  })
}

/** Local logout always works; revoking on the server is best effort. */
export async function endSession() {
  const refreshToken = session.value?.refreshToken
  access = null
  write(null)
  if (!refreshToken) return
  try {
    await post('/auth/logout', { refresh_token: refreshToken })
  } catch { /* the token still expires on its own */ }
}

const sessionExpired = () => Object.assign(new Error('Your session has expired. Please log in again.'), { code: 'SESSION_EXPIRED' })

/**
 * A valid access token for authenticated API calls. Reuses the in-memory one; otherwise rotates the
 * refresh token inside the lock (other tabs may have rotated it already, so it rereads storage first).
 */
export async function getAccessToken() {
  await ensureBackendReady()
  if (!site.auth.apiUrl) return Promise.reject(sessionExpired())
  if (access && access.expiresAt - 30_000 > Date.now() && session.value) return Promise.resolve(access.token)
  return withLock(async () => {
    if (access && access.expiresAt - 30_000 > Date.now() && read()) return access.token
    const current = read()
    session.value = current
    if (!current) throw sessionExpired()
    const res = await post('/auth/refresh', { refresh_token: current.refreshToken })
    if (res.status === 401 || res.status === 403) { write(null); throw sessionExpired() }
    if (!res.ok) throw Object.assign(new Error('The server is unreachable right now. Try again in a moment.'), { code: 'UNREACHABLE' })
    write(fromTokens(await res.json()))
    return access.token
  })
}

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === KEY || e.key === null) session.value = read()
  })
}
