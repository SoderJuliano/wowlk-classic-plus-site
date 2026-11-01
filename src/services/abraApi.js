/**
 * Thin client for Abra API (https://abra-api.top/api).
 *  - Notifications are used as a lightweight message queue: the game server polls
 *    GET /notifications/retrieve?key=<key> and processes each message.
 *  - E-mail is sent by the server-side worker (see docs/QUEUE_CONTRACT.md), never with
 *    secrets generated in the browser.
 */
import { site } from '../config/site.js'

export class AbraApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'AbraApiError'
    this.status = status
  }
}

async function request(path, { method = 'GET', body, timeoutMs = 15_000 } = {}) {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), timeoutMs)
  try {
    const res = await fetch(`${site.abra.baseUrl}${path}`, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      signal: ctrl.signal
    })
    if (!res.ok) throw new AbraApiError(`Abra API responded ${res.status}`, res.status)
    const text = await res.text()
    return text ? JSON.parse(text) : null
  } catch (err) {
    if (err instanceof AbraApiError) throw err
    throw new AbraApiError(err?.name === 'AbortError' ? 'Request timed out' : 'Network error', 0)
  } finally {
    clearTimeout(timer)
  }
}

/** Push one message into a queue key. `content` must already be a string. */
export function publish(key, title, content) {
  return request('/notifications', { method: 'POST', body: { key, title, content } })
}
