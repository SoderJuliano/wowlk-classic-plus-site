import { describe, it, expect, vi, afterEach } from 'vitest'
import { computeVerifier, makeRegistrationData, toHex } from '../src/services/srp6.js'
import { validateRegistration, validateUsername, validatePassword, passwordChecks } from '../src/utils/validation.js'
import { createBotGuard, MIN_FILL_MS } from '../src/utils/botGuard.js'

describe('SRP6 (AzerothCore)', () => {
  // Vector cross-checked against an independent Python implementation of SRP6.cpp
  it('computes the AzerothCore verifier (little-endian, upper-cased credentials)', async () => {
    const salt = Uint8Array.from({ length: 32 }, (_, i) => (i * 7 + 3) & 255)
    const v = await computeVerifier('Arthas', 'frostMourne1', salt)
    expect(toHex(v)).toBe('36c9bb05645eec334887a844d6a00ffc9f161d5311fe1c5cf19ccc1ad7cbc90e')
  })

  it('is case-insensitive like the 3.3.5a client', async () => {
    const salt = new Uint8Array(32).fill(9)
    expect(toHex(await computeVerifier('ARTHAS', 'FROSTMOURNE1', salt))).toBe(toHex(await computeVerifier('arthas', 'frostmourne1', salt)))
  })

  it('returns 32-byte hex salt and verifier with a random salt', async () => {
    const a = await makeRegistrationData('ARTHAS', 'Secret123')
    const b = await makeRegistrationData('ARTHAS', 'Secret123')
    expect(a.salt).toMatch(/^[0-9a-f]{64}$/)
    expect(a.verifier).toMatch(/^[0-9a-f]{64}$/)
    expect(a.salt).not.toBe(b.salt)
  })
})

describe('validation', () => {
  const ok = { username: 'Arthas', email: 'a@b.com', emailConfirm: 'A@B.com ', password: 'Frost123', passwordConfirm: 'Frost123', terms: true }

  it('accepts a valid registration', () => {
    expect(validateRegistration(ok).valid).toBe(true)
  })
  it('rejects mismatches and missing terms', () => {
    const r = validateRegistration({ ...ok, emailConfirm: 'x@b.com', passwordConfirm: 'nope', terms: false })
    expect(r.valid).toBe(false)
    expect(r.errors.emailConfirm).toBeTruthy()
    expect(r.errors.passwordConfirm).toBeTruthy()
    expect(r.errors.terms).toBeTruthy()
  })
  it('enforces username rules', () => {
    expect(validateUsername('ab')).toBeTruthy()
    expect(validateUsername('bad name')).toBeTruthy()
    expect(validateUsername('Jaina_')).toBeTruthy()
    expect(validateUsername('Jaina2')).toBe('')
  })
  it('enforces password rules (client limit, letters+numbers, ascii, != username)', () => {
    expect(validatePassword('short1')).toBeTruthy()
    expect(validatePassword('a'.repeat(16) + '1')).toBeTruthy()
    expect(validatePassword('onlyletters')).toBeTruthy()
    expect(validatePassword('çãoçãoç1')).toBeTruthy()
    expect(validatePassword('Arthas123', 'arthas123')).toBeTruthy()
    expect(passwordChecks('Good1234', 'x').every((c) => c.ok)).toBe(true)
  })
})

describe('bot guard', () => {
  it('flags a filled honeypot', () => {
    let t = 0
    const g = createBotGuard(() => t)
    t = MIN_FILL_MS + 1
    expect(g.isBot('http://spam')).toBe(true)
    expect(g.isBot('')).toBe(false)
  })
  it('flags submissions faster than a human', () => {
    let t = 0
    const g = createBotGuard(() => t)
    t = 300
    expect(g.isBot('')).toBe(true)
  })
})

describe('account service payloads', () => {
  afterEach(() => { vi.unstubAllGlobals(); vi.resetModules(); vi.unstubAllEnvs() })

  it('queues registration on the configured key without the plain password', async () => {
    const fetchMock = vi.fn(async () => new Response('{}', { status: 201 }))
    vi.stubGlobal('fetch', fetchMock)
    const { registerAccount } = await import('../src/services/accountService.js')
    await registerAccount({ username: 'Arthas', email: ' Arthas@Lordaeron.com ', password: 'Frostmourne1' })

    expect(fetchMock).toHaveBeenCalledTimes(1)
    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe('https://abra-api.top/notifications')
    const body = JSON.parse(init.body)
    expect(body.key).toBe('test-registration-key')
    expect(body.title).toBe('account.register')
    expect(body.content).not.toMatch(/frostmourne1/i)
    const payload = JSON.parse(body.content)
    expect(payload.account).toMatchObject({ username: 'ARTHAS', email: 'arthas@lordaeron.com', expansion: 2 })
    expect(payload.account.salt).toMatch(/^[0-9a-f]{64}$/)
    expect(payload.account.verifier).toMatch(/^[0-9a-f]{64}$/)
    expect(payload.consent.termsVersion).toBeTruthy()
  })

  it('queues password recovery on the events key without the plain password', async () => {
    const fetchMock = vi.fn(async () => new Response('{}', { status: 201 }))
    vi.stubGlobal('fetch', fetchMock)
    const { recoverPassword } = await import('../src/services/accountService.js')
    await recoverPassword({ username: 'arthas', email: ' Arthas@Lordaeron.com ', password: 'Frostmourne1' })

    const body = JSON.parse(fetchMock.mock.calls[0][1].body)
    expect(body.key).toBe('test-events-key')
    expect(body.title).toBe('password.recover')
    expect(body.content).not.toMatch(/frostmourne1/i)
    const { account } = JSON.parse(body.content)
    expect(account).toMatchObject({ username: 'ARTHAS', email: 'arthas@lordaeron.com' })
    expect(account.salt).toMatch(/^[0-9a-f]{64}$/)
    expect(account.verifier).toMatch(/^[0-9a-f]{64}$/)
  })

  it('encrypts the payload when a queue public key is configured', async () => {
    const pair = await crypto.subtle.generateKey(
      { name: 'RSA-OAEP', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' }, true, ['encrypt', 'decrypt']
    )
    const spki = Buffer.from(await crypto.subtle.exportKey('spki', pair.publicKey)).toString('base64')
    const { sealPayload } = await import('../src/services/queueCrypto.js')
    const sealed = JSON.parse(await sealPayload({ secret: 'arthas@lordaeron.com' }, spki))
    expect(sealed.enc).toBe('RSA-OAEP-256+A256GCM')
    expect(JSON.stringify(sealed)).not.toContain('lordaeron')

    const b = (s) => Buffer.from(s, 'base64')
    const raw = await crypto.subtle.decrypt({ name: 'RSA-OAEP' }, pair.privateKey, b(sealed.key))
    const aes = await crypto.subtle.importKey('raw', raw, 'AES-GCM', false, ['decrypt'])
    const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: b(sealed.iv) }, aes, b(sealed.data))
    expect(JSON.parse(new TextDecoder().decode(plain))).toEqual({ secret: 'arthas@lordaeron.com' })
  })
})

describe('login (Pikachu API)', () => {
  const importWithApi = async () => {
    vi.resetModules()
    vi.stubEnv('VITE_AUTH_API_URL', 'https://api.test/launcher/v1')
    return import('../src/services/accountService.js')
  }
  const reply = (status, body) => vi.fn(async () => new Response(typeof body === 'string' ? body : JSON.stringify(body), { status }))
  afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs() })

  it('posts {login, password} with the ngrok header and no cookies', async () => {
    const { login } = await importWithApi()
    const fetchMock = reply(200, { access_token: 'a_x', user: { id: 1, username: 'ARTHAS' } })
    vi.stubGlobal('fetch', fetchMock)
    const session = await login({ login: ' arthas ', password: 'Frostmourne1' })
    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe('https://api.test/launcher/v1/auth/login')
    expect(JSON.parse(init.body)).toEqual({ login: 'arthas', password: 'Frostmourne1' })
    expect(init.headers['ngrok-skip-browser-warning']).toBe('true')
    expect(init.credentials).toBeUndefined()
    expect(session.user.username).toBe('ARTHAS')
  })

  it('does not treat a 200 HTML page from the tunnel as a login', async () => {
    const { login } = await importWithApi()
    vi.stubGlobal('fetch', reply(200, '<!doctype html><html></html>'))
    await expect(login({ login: 'a', password: 'b' })).rejects.toMatchObject({ code: 'LOGIN_UNREACHABLE' })
  })

  it('separates wrong password, banned, rate limit and server problems', async () => {
    const { login } = await importWithApi()
    const cases = [
      [401, { error: { code: 'INVALID_CREDENTIALS', message: 'x' } }, 'INVALID_CREDENTIALS'],
      [403, { error: { code: 'ACCOUNT_BANNED', message: 'This account is banned.' } }, 'ACCOUNT_BANNED'],
      [429, { error: { code: 'RATE_LIMITED', message: 'x' } }, 'RATE_LIMITED'],
      [500, { error: { code: 'INTERNAL', message: 'x' } }, 'INTERNAL']
    ]
    for (const [status, body, code] of cases) {
      vi.stubGlobal('fetch', reply(status, body))
      await expect(login({ login: 'a', password: 'b' })).rejects.toMatchObject({ code })
    }
  })

  it('reports a network failure as unreachable, not as a wrong password', async () => {
    const { login } = await importWithApi()
    vi.stubGlobal('fetch', vi.fn(async () => { throw new TypeError('offline') }))
    await expect(login({ login: 'a', password: 'b' })).rejects.toMatchObject({ code: 'LOGIN_UNREACHABLE' })
  })
})

describe('web session', () => {
  const load = async () => {
    vi.resetModules()
    vi.stubEnv('VITE_AUTH_API_URL', 'https://api.test/launcher/v1')
    return import('../src/services/session.js')
  }
  const tokens = (rt = 'r_1') => ({ refresh_token: rt, refresh_expires_in: 2592000, access_token: 'a_x', user: { id: 1, username: 'ARTHAS' } })
  const makeStale = () => {
    const s = JSON.parse(localStorage.getItem('wowlk.session'))
    localStorage.setItem('wowlk.session', JSON.stringify({ ...s, checkedAt: 0 }))
  }
  afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); localStorage.clear() })

  it('survives a reload and never stores the access token', async () => {
    (await load()).startSession(tokens())
    expect(localStorage.getItem('wowlk.session')).not.toContain('a_x')
    expect((await load()).session.value.username).toBe('ARTHAS')
  })

  it('ignores an expired session', async () => {
    localStorage.setItem('wowlk.session', JSON.stringify({ username: 'ARTHAS', refreshToken: 'r', refreshExpiresAt: Date.now() - 1, checkedAt: 0 }))
    expect((await load()).session.value).toBeNull()
  })

  it('does not call the API on page load when recently checked', async () => {
    const s = await load()
    s.startSession(tokens())
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
    await s.revalidateSession()
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('stores the rotated token on revalidation', async () => {
    (await load()).startSession(tokens())
    makeStale()
    const s = await load()
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify(tokens('r_2')), { status: 200 })))
    await s.revalidateSession()
    expect(s.session.value.refreshToken).toBe('r_2')
  })

  it('ends the session when the server revokes it, but keeps it on a network failure', async () => {
    (await load()).startSession(tokens())
    makeStale()
    let s = await load()
    vi.stubGlobal('fetch', vi.fn(async () => { throw new TypeError('offline') }))
    await s.revalidateSession()
    expect(s.session.value).not.toBeNull()
    s = await load()
    vi.stubGlobal('fetch', vi.fn(async () => new Response('{}', { status: 401 })))
    await s.revalidateSession()
    expect(s.session.value).toBeNull()
    expect(localStorage.getItem('wowlk.session')).toBeNull()
  })

  it('logs out locally even if the server is unreachable', async () => {
    const s = await load()
    s.startSession(tokens())
    vi.stubGlobal('fetch', vi.fn(async () => { throw new TypeError('offline') }))
    await s.endSession()
    expect(s.session.value).toBeNull()
  })
})
