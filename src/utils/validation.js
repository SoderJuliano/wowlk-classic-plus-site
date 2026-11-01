/**
 * Field rules shared by every auth form. They follow the limits of the
 * 3.3.5a client and AzerothCore (account names ≤ 20, client password box ≤ 16).
 */
export const RULES = Object.freeze({
  usernameMin: 3,
  usernameMax: 16,
  passwordMin: 8,
  passwordMax: 16,
  emailMax: 254
})

const USERNAME_RE = /^[A-Za-z0-9]+$/
// Pragmatic e-mail check — final say is the verification link.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
// Printable ASCII only: the WoW client and SRP6 upper-casing are Latin-only.
const PASSWORD_CHARSET_RE = /^[\x21-\x7E]+$/

export function validateUsername(v) {
  const s = (v ?? '').trim()
  if (!s) return 'Choose a username.'
  if (s.length < RULES.usernameMin || s.length > RULES.usernameMax)
    return `Username must be ${RULES.usernameMin}–${RULES.usernameMax} characters.`
  if (!USERNAME_RE.test(s)) return 'Use only letters (A–Z) and numbers.'
  return ''
}

export function validateEmail(v) {
  const s = (v ?? '').trim()
  if (!s) return 'Enter your e-mail address.'
  if (s.length > RULES.emailMax || !EMAIL_RE.test(s)) return 'Enter a valid e-mail address.'
  return ''
}

export function validateEmailConfirm(email, confirm) {
  if (!(confirm ?? '').trim()) return 'Confirm your e-mail address.'
  return normalizeEmail(email) === normalizeEmail(confirm) ? '' : 'E-mail addresses do not match.'
}

export function passwordChecks(password, username = '') {
  const p = password ?? ''
  return [
    { id: 'length', label: `${RULES.passwordMin}–${RULES.passwordMax} characters`, ok: p.length >= RULES.passwordMin && p.length <= RULES.passwordMax },
    { id: 'letter', label: 'At least one letter', ok: /[A-Za-z]/.test(p) },
    { id: 'number', label: 'At least one number', ok: /\d/.test(p) },
    { id: 'charset', label: 'No spaces or accented characters', ok: p.length > 0 && PASSWORD_CHARSET_RE.test(p) },
    { id: 'username', label: 'Different from your username', ok: p.length > 0 && p.toUpperCase() !== (username ?? '').trim().toUpperCase() }
  ]
}

export function validatePassword(password, username) {
  if (!password) return 'Create a password.'
  const failed = passwordChecks(password, username).find((c) => !c.ok)
  return failed ? `Password requirement: ${failed.label.toLowerCase()}.` : ''
}

export function validatePasswordConfirm(password, confirm) {
  if (!confirm) return 'Confirm your password.'
  return password === confirm ? '' : 'Passwords do not match.'
}

/** 0–4 strength score for the meter (informational only). */
export function passwordStrength(password) {
  const p = password ?? ''
  let score = 0
  if (p.length >= 8) score++
  if (p.length >= 12) score++
  if (/[A-Za-z]/.test(p) && /\d/.test(p)) score++
  if (/[^A-Za-z0-9]/.test(p)) score++
  return score
}

export const normalizeEmail = (v) => (v ?? '').trim().toLowerCase()
export const normalizeUsername = (v) => (v ?? '').trim().toUpperCase()

export function validateRegistration(form) {
  const errors = {
    username: validateUsername(form.username),
    email: validateEmail(form.email),
    emailConfirm: validateEmailConfirm(form.email, form.emailConfirm),
    password: validatePassword(form.password, form.username),
    passwordConfirm: validatePasswordConfirm(form.password, form.passwordConfirm),
    terms: form.terms ? '' : 'You must accept the Terms of Use.'
  }
  return { errors, valid: Object.values(errors).every((e) => !e) }
}
