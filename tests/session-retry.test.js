// 27/11/2026: the QR code asked for login while the player was logged in. Another tab (or the
// launcher's #sso hand-off) had refreshed the session, which replaces the access token on the
// server; this tab's in-memory copy got 401. The request must renew once and succeed.
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { site } from '../src/config/site.js'
import { startSession, session } from '../src/services/session.js'
import { createClient64PixPayment } from '../src/services/donationService.js'

const tokens = (n) => ({
  access_token: `A${n}`, expires_in: 900, refresh_token: `R${n}`, refresh_expires_in: 2592000, user: { username: 'ADMIN' }
})
const json = (status, body) => ({ ok: status >= 200 && status < 300, status, json: async () => body })

describe('authenticated donation calls', () => {
  beforeEach(() => {
    site.auth.apiUrl = 'https://api.test/launcher/v1'
    site.donation.apiUrl = 'https://api.test/donation/v1'
    localStorage.clear()
  })

  it('a stale access token (401) is renewed once and the Pix request goes through', async () => {
    startSession(tokens(1))   // this tab holds A1 in memory
    const calls = []
    vi.stubGlobal('fetch', vi.fn(async (url, init) => {
      const auth = init.headers?.Authorization
      calls.push(`${url.replace('https://api.test', '')} ${auth ?? ''}`)
      if (url.endsWith('/auth/refresh')) return json(200, tokens(2))
      if (url.endsWith('/client64/payments/pix')) return auth === 'Bearer A2' ? json(201, { id: 'P1', status: 'pending' }) : json(401, { error: { code: 'UNAUTHORIZED', message: 'Please sign in again.' } })
      return json(404, {})
    }))
    const r = await createClient64PixPayment('idem-1')
    expect(r.id).toBe('P1')
    expect(calls).toEqual([
      '/donation/v1/client64/payments/pix Bearer A1',
      '/launcher/v1/auth/refresh ',
      '/donation/v1/client64/payments/pix Bearer A2'
    ])
    expect(session.value?.username).toBe('ADMIN')
  })

  it('asks to log in only when the session itself is gone', async () => {
    startSession(tokens(1))
    vi.stubGlobal('fetch', vi.fn(async (url) => {
      if (url.endsWith('/auth/refresh')) return json(401, { error: { code: 'INVALID_REFRESH_TOKEN' } })
      return json(401, { error: { code: 'UNAUTHORIZED', message: 'Please sign in again.' } })
    }))
    await expect(createClient64PixPayment('idem-2')).rejects.toMatchObject({ code: 'SESSION_EXPIRED' })
    expect(session.value).toBeNull()
  })
})
