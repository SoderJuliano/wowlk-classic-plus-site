/**
 * AzerothCore SRP6 credential generation (WotLK 3.3.5a).
 *
 * Mirrors src/common/Cryptography/Authentication/SRP6.cpp:
 *   h1 = SHA1( UPPER(username) ":" UPPER(password) )
 *   x  = SHA1( salt || h1 )              → read as little-endian integer
 *   v  = g^x mod N                       → stored as 32-byte little-endian
 * Columns: account.salt BINARY(32), account.verifier BINARY(32).
 *
 * The plain password never leaves the browser.
 */
const N = BigInt('0x894B645E89E1535BBDAD5B8B290650530801B18EBFBF5E8FAB3C82872A3E9BB7')
const g = 7n

const enc = new TextEncoder()

async function sha1(...parts) {
  const total = parts.reduce((n, p) => n + p.length, 0)
  const buf = new Uint8Array(total)
  let o = 0
  for (const p of parts) { buf.set(p, o); o += p.length }
  return new Uint8Array(await crypto.subtle.digest('SHA-1', buf))
}

function leBytesToBigInt(bytes) {
  let n = 0n
  for (let i = bytes.length - 1; i >= 0; i--) n = (n << 8n) | BigInt(bytes[i])
  return n
}

function bigIntToLeBytes(n, size) {
  const out = new Uint8Array(size)
  for (let i = 0; i < size; i++) { out[i] = Number(n & 0xffn); n >>= 8n }
  return out
}

function modPow(base, exp, mod) {
  let result = 1n
  base %= mod
  while (exp > 0n) {
    if (exp & 1n) result = (result * base) % mod
    base = (base * base) % mod
    exp >>= 1n
  }
  return result
}

export const toHex = (bytes) => Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')

/** AzerothCore upper-cases only Latin letters (Utf8ToUpperOnlyLatin). */
export const upperLatin = (s) => s.replace(/[a-z]/g, (c) => c.toUpperCase())

export async function computeVerifier(username, password, salt) {
  const h1 = await sha1(enc.encode(`${upperLatin(username)}:${upperLatin(password)}`))
  const x = leBytesToBigInt(await sha1(salt, h1))
  return bigIntToLeBytes(modPow(g, x, N), 32)
}

/** Returns hex strings ready for `UNHEX()` in MySQL. */
export async function makeRegistrationData(username, password, salt = crypto.getRandomValues(new Uint8Array(32))) {
  const verifier = await computeVerifier(username, password, salt)
  return { salt: toHex(salt), verifier: toHex(verifier) }
}
