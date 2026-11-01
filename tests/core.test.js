import { describe, it, expect, vi, afterEach } from 'vitest'
import { computeVerifier, makeRegistrationData, toHex } from '../src/services/srp6.js'
import { validateRegistration, validateUsername, validatePassword, passwordChecks } from '../src/utils/validation.js'
import { createBotGuard, MIN_FILL_MS } from '../src/utils/botGuard.js'
import { isValidLink } from '../src/utils/linkParams.js'

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
  it('validates server-issued link params', () => {
    expect(isValidLink('ARTHAS', 'abcDEF0123456789_-')).toBe(true)
    expect(isValidLink('AR', 'abcDEF0123456789')).toBe(false)
    expect(isValidLink('ARTHAS', 'short')).toBe(false)
    expect(isValidLink('ARTHAS', '<script>alert(1)</script>xxxxxxx')).toBe(false)
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
