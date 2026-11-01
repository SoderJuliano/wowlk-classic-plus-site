/**
 * Client-side anti-bot gate. Runs BEFORE any network call.
 * - Honeypot: a hidden `website` field humans never see. Any value = bot.
 * - Minimum fill time: real people need more than a couple of seconds.
 * A blocked submission is dropped silently — no request, no revealing message.
 *
 * This only filters naive bots. Real protection (rate limiting per IP, payload
 * validation, adaptive CAPTCHA) must live server-side — see docs/QUEUE_CONTRACT.md.
 */
export const MIN_FILL_MS = 2500

export function createBotGuard(now = () => Date.now()) {
  const startedAt = now()
  return {
    startedAt,
    isBot(honeypotValue) {
      if (typeof honeypotValue === 'string' && honeypotValue.length > 0) return true
      return now() - startedAt < MIN_FILL_MS
    }
  }
}

const COOLDOWN_PREFIX = 'wcplk:cooldown:'
/** Soft per-browser throttle to stop accidental double submits. Not a security control. */
export function cooldownRemaining(action, windowMs) {
  try {
    const last = Number(localStorage.getItem(COOLDOWN_PREFIX + action) || 0)
    return Math.max(0, last + windowMs - Date.now())
  } catch { return 0 }
}
export function markCooldown(action) {
  try { localStorage.setItem(COOLDOWN_PREFIX + action, String(Date.now())) } catch { /* private mode */ }
}
