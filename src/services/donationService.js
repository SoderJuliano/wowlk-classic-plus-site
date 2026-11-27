/**
 * Donations through Pikachu (/donation/v1) and Mercado Pago.
 *
 * - Brazil → Pix (QR code + copy-and-paste code). Elsewhere → card.
 * - Card numbers never reach our server: Mercado Pago's own SDK turns them into a one-time token in the
 *   browser, and only that token is sent to Pikachu. The inputs use the standard `cc-*` autocomplete
 *   names, so the browser can offer the cards it already saved.
 * - A payment only counts as done when `recorded` is true: Pikachu writes it after Mercado Pago's
 *   webhook arrives and the payment is re-read from Mercado Pago as approved.
 */
import { ref } from 'vue'
import { site } from '../config/site.js'
import { session, getAccessToken, invalidateAccessToken } from './session.js'
import { ensureBackendReady, isDiscovering } from './backendDiscovery.js'

const SDK_URL = 'https://sdk.mercadopago.com/js/v2'

export const isDonationAvailable = () => Boolean(site.donation.apiUrl) || isDiscovering.value || (typeof window !== 'undefined')

const apiError = (code, message, extra = {}) => Object.assign(new Error(message), { code, ...extra })
const UNREACHABLE = 'The donation service is unreachable right now. Try again in a moment.'

async function call(path, { method = 'GET', body, auth = true, idempotencyKey, retried = false } = {}) {
  await ensureBackendReady()
  if (!site.donation.apiUrl) throw apiError('UNAVAILABLE', 'Donations are not available yet.')
  const headers = { Accept: 'application/json', 'ngrok-skip-browser-warning': 'true' }
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  if (idempotencyKey) headers['X-Idempotency-Key'] = idempotencyKey
  const token = auth ? await getAccessToken() : null
  if (auth) headers.Authorization = `Bearer ${token}`
  let res
  try {
    res = await fetch(`${site.donation.apiUrl}${path}`, {
      method, headers, body: body === undefined ? undefined : JSON.stringify(body), signal: AbortSignal.timeout(30_000)
    })
  } catch {
    throw apiError('UNREACHABLE', UNREACHABLE)
  }
  let data = null
  try { data = await res.json() } catch { /* empty or HTML (tunnel down) */ }
  if (res.ok) return data
  // Access token replaced by a refresh elsewhere (other tab, launcher #sso): renew once and retry.
  // Only if the renewal itself fails does the player have to log in again (getAccessToken throws).
  // Same idempotency key, so a retried Pix/card request never charges twice.
  if (res.status === 401 && auth && !retried) {
    invalidateAccessToken(token)
    return call(path, { method, body, auth, idempotencyKey, retried: true })
  }
  const code = data?.error?.code
  // Messages from the API are written to be shown to the player.
  throw apiError(code ?? 'UNREACHABLE', data?.error?.message ?? UNREACHABLE, { status: res.status })
}

/** Public settings: Mercado Pago public key, amount limits, gateway (mercadopago | mock). */
let configPromise = null
export function getDonationConfig() {
  configPromise ??= call('/config', { auth: false }).catch((e) => { configPromise = null; throw e })
  return configPromise
}

export const createPixPayment = (amount, idempotencyKey) =>
  call('/payments/pix', { method: 'POST', body: { amount }, idempotencyKey })

export const createCardPayment = (payload, idempotencyKey) =>
  call('/payments/card', { method: 'POST', body: payload, idempotencyKey })

export const getPayment = (id) => call(`/payments/${encodeURIComponent(id)}`)

// ------------------------------------------------------------------ 64-bit client early access (wowsixtyfordev)

let client64ConfigPromise = null
export function getClient64DonationConfig() {
  client64ConfigPromise ??= call('/client64/config', { auth: false }).catch((e) => { client64ConfigPromise = null; throw e })
  return client64ConfigPromise
}

export const createClient64PixPayment = (idempotencyKey) =>
  call('/client64/payments/pix', { method: 'POST', idempotencyKey })

export const createClient64CardPayment = (payload, idempotencyKey) =>
  call('/client64/payments/card', { method: 'POST', body: payload, idempotencyKey })

export const getClient64Payment = (id) => call(`/client64/payments/${encodeURIComponent(id)}`)

export const client64Supporter = ref(null)
let client64SupporterFor = null

export async function refreshClient64Supporter({ force = false } = {}) {
  const username = session.value?.username
  if (!username || !isDonationAvailable()) { client64Supporter.value = null; client64SupporterFor = null; return null }
  if (!force && client64SupporterFor === username && client64Supporter.value) return client64Supporter.value
  try {
    client64Supporter.value = await call('/client64/me')
    client64SupporterFor = username
  } catch {
    client64Supporter.value = null
  }
  return client64Supporter.value
}

/** Dev only (Pikachu with donation.dev-tools): plays Mercado Pago's role and delivers a signed webhook. */
export const simulateWebhook = (id) => call(`/dev/simulate-webhook/${encodeURIComponent(id)}`, { method: 'POST', auth: false })

export const newIdempotencyKey = () =>
  (globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`)

// ------------------------------------------------------------------ supporter badge

/** `{ supporter, since, donations }` for the logged-in player, or null. Shown only to that player. */
export const supporter = ref(null)
let supporterFor = null

export async function refreshSupporter({ force = false } = {}) {
  const username = session.value?.username
  if (!username || !isDonationAvailable()) { supporter.value = null; supporterFor = null; return null }
  if (!force && supporterFor === username && supporter.value) return supporter.value
  try {
    supporter.value = await call('/me')
    supporterFor = username
  } catch {
    supporter.value = null // the badge is cosmetic: never break the page over it
  }
  return supporter.value
}

// ------------------------------------------------------------------ region

const BRAZIL_ZONES = new Set([
  'America/Sao_Paulo', 'America/Rio_Branco', 'America/Manaus', 'America/Cuiaba', 'America/Campo_Grande',
  'America/Belem', 'America/Fortaleza', 'America/Recife', 'America/Maceio', 'America/Bahia', 'America/Araguaina',
  'America/Santarem', 'America/Porto_Velho', 'America/Boa_Vista', 'America/Eirunepe', 'America/Noronha', 'Brazil/East'
])

/** 'BR' when the browser looks Brazilian (time zone or pt-BR language), otherwise 'INTL'. */
export function detectRegion({ timeZone, languages } = {}) {
  const tz = timeZone ?? safeTimeZone()
  const langs = languages ?? (typeof navigator !== 'undefined' ? navigator.languages ?? [navigator.language] : [])
  if (BRAZIL_ZONES.has(tz)) return 'BR'
  return langs.some((l) => /^pt-BR$/i.test(l || '')) ? 'BR' : 'INTL'
}

function safeTimeZone() {
  try { return Intl.DateTimeFormat().resolvedOptions().timeZone } catch { return '' }
}

/** Brazil always pays with Pix; every other region with card. */
export const methodForRegion = (region) => (region === 'BR' ? 'pix' : 'card')

// ------------------------------------------------------------------ card helpers

export const onlyDigits = (s) => String(s ?? '').replace(/\D/g, '')

/** Luhn check, so obvious typos are caught before calling Mercado Pago. */
export function isValidCardNumber(value) {
  const d = onlyDigits(value)
  if (d.length < 13 || d.length > 19) return false
  let sum = 0
  for (let i = 0; i < d.length; i++) {
    let n = Number(d[d.length - 1 - i])
    if (i % 2 === 1) { n *= 2; if (n > 9) n -= 9 }
    sum += n
  }
  return sum % 10 === 0
}

/** "4235 6477 2802 5682" (Amex: 4-6-5). */
export function formatCardNumber(value) {
  const d = onlyDigits(value).slice(0, 19)
  if (/^3[47]/.test(d)) return [d.slice(0, 4), d.slice(4, 10), d.slice(10, 15)].filter(Boolean).join(' ')
  return d.replace(/(.{4})/g, '$1 ').trim()
}

/** Accepts "MM/YY", "MM / YYYY", "MMYY". Returns { month, year } (4-digit year) or null. */
export function parseExpiry(value, now = new Date()) {
  const m = String(value ?? '').match(/^\s*(\d{1,2})\s*\/?\s*(\d{2}|\d{4})\s*$/)
  if (!m) return null
  const month = Number(m[1])
  let year = Number(m[2])
  if (year < 100) year += 2000
  if (month < 1 || month > 12) return null
  const endOfMonth = new Date(year, month, 1)
  if (endOfMonth <= now) return null
  return { month, year }
}

/** Fallback brand when Mercado Pago's BIN lookup returns nothing (it still validates on payment). */
export function guessBrand(cardNumber) {
  const d = onlyDigits(cardNumber)
  if (/^4/.test(d)) return 'visa'
  if (/^3[47]/.test(d)) return 'amex'
  if (/^(5[1-5]|2[2-7]|50)/.test(d)) return 'master'
  return null
}

let sdkPromise = null
function loadSdk() {
  if (typeof window === 'undefined') return Promise.reject(new Error('No browser'))
  if (window.MercadoPago) return Promise.resolve(window.MercadoPago)
  sdkPromise ??= new Promise((resolve, reject) => {
    const s = document.createElement('script')
    s.src = SDK_URL
    s.async = true
    s.onload = () => (window.MercadoPago ? resolve(window.MercadoPago) : reject(new Error('SDK missing')))
    s.onerror = () => { sdkPromise = null; s.remove(); reject(new Error('SDK failed to load')) }
    document.head.appendChild(s)
  })
  return sdkPromise
}

let mpInstance = null
async function mercadoPago(publicKey) {
  const MercadoPago = await loadSdk()
  mpInstance ??= new MercadoPago(publicKey, { locale: 'en-US' })
  return mpInstance
}

/**
 * Turns the card into a one-time Mercado Pago token in the browser.
 * In mock mode (local tests) nothing leaves the page: the token only carries the holder name,
 * so "APRO" approves and "OTHE" is rejected, like Mercado Pago's test cards.
 */
export async function tokenizeCard(config, { number, holder, expiry, cvv, docType, docNumber }) {
  const exp = parseExpiry(expiry)
  if (!isValidCardNumber(number)) throw apiError('VALIDATION', 'Check the card number.')
  if (!exp) throw apiError('VALIDATION', 'Check the expiry date (MM/YY).')
  if (!/^\d{3,4}$/.test(onlyDigits(cvv))) throw apiError('VALIDATION', 'Check the security code.')
  if (!String(holder ?? '').trim()) throw apiError('VALIDATION', 'Enter the name printed on the card.')

  if (config.gateway === 'mock') {
    return { token: `mock-${holder.trim().toUpperCase().replace(/[^A-Z]/g, '')}`, paymentMethodId: guessBrand(number) ?? 'master', issuerId: null }
  }
  if (!config.publicKey) throw apiError('UNAVAILABLE', 'Card payments are not configured yet.')
  let mp
  try {
    mp = await mercadoPago(config.publicKey)
  } catch {
    throw apiError('UNREACHABLE', 'Could not load the secure card form. Disable blockers for sdk.mercadopago.com and try again.')
  }
  const digits = onlyDigits(number)
  let method = null
  try {
    const found = await mp.getPaymentMethods({ bin: digits.slice(0, 8) })
    method = found?.results?.[0] ?? null
  } catch { /* falls back to the brand guess */ }
  const paymentMethodId = method?.id ?? guessBrand(digits)
  if (!paymentMethodId) throw apiError('VALIDATION', 'This card brand is not accepted.')
  let token
  try {
    token = await mp.createCardToken({
      cardNumber: digits,
      cardholderName: holder.trim(),
      cardExpirationMonth: String(exp.month).padStart(2, '0'),
      cardExpirationYear: String(exp.year),
      securityCode: onlyDigits(cvv),
      ...(onlyDigits(docNumber) ? { identificationType: docType || 'CPF', identificationNumber: onlyDigits(docNumber) } : {})
    })
  } catch {
    throw apiError('VALIDATION', 'The card was not accepted. Check the details and try again.')
  }
  if (!token?.id) throw apiError('VALIDATION', 'The card was not accepted. Check the details and try again.')
  return { token: token.id, paymentMethodId, issuerId: method?.issuer?.id != null ? String(method.issuer.id) : null }
}

// ------------------------------------------------------------------ status text

const CARD_REJECTIONS = {
  cc_rejected_insufficient_amount: 'Insufficient funds.',
  cc_rejected_bad_filled_security_code: 'Wrong security code.',
  cc_rejected_bad_filled_date: 'Wrong expiry date.',
  cc_rejected_bad_filled_card_number: 'Wrong card number.',
  cc_rejected_bad_filled_other: 'Check the card details.',
  cc_rejected_call_for_authorize: 'Your bank needs you to authorize this payment. Contact your bank and try again.',
  cc_rejected_card_disabled: 'This card is disabled. Contact your bank.',
  cc_rejected_high_risk: 'The payment was declined. Try another card.',
  cc_rejected_duplicated_payment: 'You already made a payment with this amount. Use another card or amount.',
  cc_rejected_max_attempts: 'Too many attempts with this card. Try another card.'
}

export function rejectionMessage(statusDetail) {
  return CARD_REJECTIONS[statusDetail] ?? 'The payment was declined. Check the details or try another card.'
}
