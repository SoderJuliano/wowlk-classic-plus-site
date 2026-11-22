<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import AuthLayout from '../components/auth/AuthLayout.vue'
import AppIcon from '../components/ui/AppIcon.vue'
import { session } from '../services/session.js'
import {
  isDonationAvailable, getDonationConfig, createPixPayment, createCardPayment, getPayment, simulateWebhook,
  newIdempotencyKey, refreshSupporter, supporter, detectRegion, methodForRegion, tokenizeCard,
  formatCardNumber, rejectionMessage, onlyDigits
} from '../services/donationService.js'
import { site } from '../config/site.js'

const available = computed(() => isDonationAvailable())
const config = ref(null)
const configError = ref('')

const region = ref(detectRegion())
const method = computed(() => methodForRegion(region.value))

const presets = site.donation.presets
const amount = ref(presets[1])
const custom = ref('')
/** Fixed amount set on the server (the server ignores what we send); otherwise the player's choice. */
const fixedAmount = computed(() => (config.value?.fixedAmount != null ? Number(config.value.fixedAmount) : null))
const usdEquivalent = computed(() => (config.value?.usdEquivalent != null ? Number(config.value.usdEquivalent) : null))
const chosenAmount = computed(() => fixedAmount.value ?? (custom.value !== '' ? Number(String(custom.value).replace(',', '.')) : amount.value))

const card = reactive({ holder: '', number: '', expiry: '', cvv: '', docNumber: '' })

/** idle → pending (Pix waiting / card processing) → done | failed */
const phase = ref('idle')
const busy = ref(false)
const error = ref('')
const payment = ref(null)
const copied = ref(false)
const now = ref(Date.now())
let idempotencyKey = newIdempotencyKey()
let pollTimer = null
let clockTimer = null

const money = (v) => new Intl.NumberFormat(region.value === 'BR' ? 'pt-BR' : 'en-US', { style: 'currency', currency: config.value?.currency ?? 'BRL' }).format(Number(v) || 0)
const usd = (v) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(v) || 0)
/** Brazil sees R$ 29,90; elsewhere "US$ 5.04 (R$ 29.90)" — Mercado Pago always charges BRL, the bank converts. */
const priceLabel = (v) => (region.value !== 'BR' && usdEquivalent.value != null && fixedAmount.value === Number(v)
  ? `${usd(usdEquivalent.value)} (${money(v)})` : money(v))
const minAmount = computed(() => Number(config.value?.minAmount ?? 5))
const maxAmount = computed(() => Number(config.value?.maxAmount ?? 1000))
const amountValid = computed(() => Number.isFinite(chosenAmount.value) && chosenAmount.value >= minAmount.value && chosenAmount.value <= maxAmount.value
  && Math.abs(Math.round(chosenAmount.value * 100) - chosenAmount.value * 100) < 1e-6)
/** Sent as a 2-decimal number (10.1 * 100 is not exactly 1010 in floating point). */
const amountToSend = () => Number(chosenAmount.value.toFixed(2))

const expiresIn = computed(() => {
  const at = payment.value?.pix?.expiresAt
  if (!at) return ''
  const s = Math.max(0, Math.floor((Date.parse(at) - now.value) / 1000))
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
})
const pixExpired = computed(() => payment.value?.pix?.expiresAt && Date.parse(payment.value.pix.expiresAt) <= now.value)
const since = computed(() => supporter.value?.since ? new Date(supporter.value.since).toLocaleDateString() : '')

onMounted(async () => {
  clockTimer = setInterval(() => { now.value = Date.now() }, 1000)
  if (!available) return
  try { config.value = await getDonationConfig() } catch (e) { configError.value = e.message }
  if (session.value) refreshSupporter()
})
onBeforeUnmount(() => { stopPolling(); clearInterval(clockTimer) })
watch(() => session.value?.username, () => { if (session.value) refreshSupporter({ force: true }) })

function pickPreset(v) { amount.value = v; custom.value = '' }
function switchRegion() { if (phase.value !== 'pending') { region.value = region.value === 'BR' ? 'INTL' : 'BR'; error.value = '' } }

async function startPix() {
  error.value = ''
  if (!amountValid.value) { error.value = `Choose an amount between ${money(minAmount.value)} and ${money(maxAmount.value)}.`; return }
  busy.value = true
  try {
    payment.value = await createPixPayment(amountToSend(), idempotencyKey)
    phase.value = 'pending'
    poll()
  } catch (e) {
    error.value = e.message
    if (e.status) idempotencyKey = newIdempotencyKey() // the server answered: a retry is a new attempt
  } finally {
    busy.value = false
  }
}

async function payCard() {
  error.value = ''
  if (!amountValid.value) { error.value = `Choose an amount between ${money(minAmount.value)} and ${money(maxAmount.value)}.`; return }
  busy.value = true
  try {
    const t = await tokenizeCard(config.value, card)
    const p = await createCardPayment({
      amount: amountToSend(),
      token: t.token,
      payment_method_id: t.paymentMethodId,
      issuer_id: t.issuerId,
      identification_type: onlyDigits(card.docNumber) ? 'CPF' : null,
      identification_number: onlyDigits(card.docNumber) || null
    }, idempotencyKey)
    payment.value = p
    if (p.status === 'rejected') { fail(rejectionMessage(p.statusDetail)); return }
    phase.value = 'pending'
    poll()
  } catch (e) {
    error.value = e.message
    if (e.status) idempotencyKey = newIdempotencyKey()
  } finally {
    busy.value = false
    card.cvv = ''
  }
}

function fail(message) {
  stopPolling()
  idempotencyKey = newIdempotencyKey() // the next attempt is a new payment
  error.value = message
  phase.value = 'failed'
}

function stopPolling() { clearTimeout(pollTimer); pollTimer = null }

/** Asks Pikachu until the webhook has recorded the payment (recorded = true). */
function poll() {
  stopPolling()
  pollTimer = setTimeout(async () => {
    try {
      const p = await getPayment(payment.value.id)
      payment.value = { ...payment.value, ...p, pix: p.pix ?? payment.value.pix }
      if (p.recorded || p.status === 'approved') {
        phase.value = 'done'
        refreshSupporter({ force: true })
        return
      }
      if (['rejected', 'cancelled', 'refunded', 'charged_back'].includes(p.status)) {
        fail(p.method === 'pix' ? 'This Pix code expired or was cancelled. Generate a new one.' : rejectionMessage(p.statusDetail))
        return
      }
    } catch (e) {
      if (e.code === 'SESSION_EXPIRED') { fail(e.message); return }
      /* network hiccup: keep waiting */
    }
    if (pixExpired.value && payment.value.status !== 'approved') { fail('This Pix code expired. Generate a new one.'); return }
    poll()
  }, site.donation.pollMs)
}

async function copyCode() {
  try {
    await navigator.clipboard.writeText(payment.value.pix.qrCode)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2500)
  } catch { /* the code stays selectable in the box */ }
}

async function simulate() {
  try { await simulateWebhook(payment.value.id) } catch (e) { error.value = e.message }
}

function reset() {
  stopPolling()
  phase.value = 'idle'
  payment.value = null
  error.value = ''
  idempotencyKey = newIdempotencyKey()
}
</script>

<template>
  <AuthLayout title="Become a Supporter" subtitle="Become a supporter and unlock unreleased features before everyone else." wide>
    <ul class="perks">
      <li><AppIcon name="sparkles" :size="16" /> Early access to unreleased features and test builds</li>
      <li><AppIcon name="crown" :size="16" /> Supporter badge on your account</li>
      <li><AppIcon name="shield" :size="16" /> Never pay-to-win: no stats, gear, gold or XP</li>
    </ul>

    <p v-if="!available" class="alert alert--info">Donations are not available yet. Thank you for wanting to help!</p>

    <template v-else-if="!session">
      <p class="alert alert--info">Log in first, so your support is linked to your game account.</p>
      <RouterLink :to="{ name: 'login' }" class="btn btn--gold btn--lg btn--block">Log In</RouterLink>
    </template>

    <template v-else>
      <p v-if="supporter?.supporter && phase !== 'done'" class="alert alert--success sup-chip" role="status">
        <AppIcon name="crown" :size="18" /> You are a <strong>Supporter</strong><span v-if="since">&nbsp;since {{ since }}</span>. Thank you!
      </p>
      <p v-if="configError" class="alert alert--error" role="alert">{{ configError }}</p>

      <!-- Success -->
      <div v-if="phase === 'done'" class="done" role="status">
        <div class="done__icon"><AppIcon name="check" :size="40" /></div>
        <h2 class="gold-text">Payment confirmed</h2>
        <p>Your donation of <strong>{{ priceLabel(payment.amount) }}</strong> was registered successfully. Thank you for keeping the realm alive!</p>
        <p class="done__badge"><AppIcon name="crown" :size="18" /> The <strong>Supporter</strong> badge is now on your account.</p>
        <RouterLink to="/" class="btn btn--gold btn--block">Back to Home</RouterLink>
      </div>

      <!-- Pix waiting for payment -->
      <div v-else-if="phase === 'pending' && payment?.method === 'pix'" class="pix">
        <p class="pix__amount">Pix · <strong>{{ money(payment.amount) }}</strong></p>
        <img v-if="payment.pix?.qrCodeImage" :src="payment.pix.qrCodeImage" alt="Pix QR code" class="pix__qr" width="240" height="240" />
        <label class="field">
          <span>Pix copy-and-paste code</span>
          <textarea class="input pix__code" readonly rows="3" :value="payment.pix?.qrCode" @focus="$event.target.select()" />
        </label>
        <button type="button" class="btn btn--frost btn--block" @click="copyCode">
          <AppIcon :name="copied ? 'check' : 'layers'" :size="16" /> {{ copied ? 'Copied!' : 'Copy code' }}
        </button>
        <p class="wait" role="status" aria-live="polite">
          <span class="spinner" /> Waiting for payment confirmation<span v-if="expiresIn"> · expires in {{ expiresIn }}</span>
        </p>
        <p class="note">Open your bank app, choose Pix and scan the code. This page updates by itself as soon as Mercado Pago confirms the payment.</p>
        <button v-if="config?.devTools" type="button" class="btn btn--ghost btn--sm" @click="simulate">Simulate payment (dev)</button>
        <button type="button" class="btn btn--ghost btn--sm" @click="reset">Cancel</button>
      </div>

      <!-- Card processing -->
      <div v-else-if="phase === 'pending'" class="wait-card" role="status" aria-live="polite">
        <p class="wait"><span class="spinner" /> {{ payment?.status === 'approved' ? 'Payment approved — registering your donation…' : 'Processing your payment…' }}</p>
        <button v-if="config?.devTools" type="button" class="btn btn--ghost btn--sm" @click="simulate">Deliver webhook (dev)</button>
      </div>

      <!-- Form -->
      <template v-else>
        <p v-if="error" class="alert alert--error" role="alert">{{ error }}</p>

        <div class="region">
          <span><AppIcon name="globe" :size="16" /> {{ region === 'BR' ? 'Brazil — pay with Pix' : 'Outside Brazil — pay with card' }}</span>
          <button type="button" class="linkish" @click="switchRegion">{{ region === 'BR' ? 'Not in Brazil?' : 'In Brazil?' }}</button>
        </div>

        <div v-if="fixedAmount != null" class="price">
          <span class="price__label">Supporter donation</span>
          <strong class="price__value gold-text">{{ region === 'BR' ? money(fixedAmount) : (usdEquivalent != null ? `≈ ${usd(usdEquivalent)}` : money(fixedAmount)) }}</strong>
          <span v-if="region !== 'BR'" class="price__note">Charged as {{ money(fixedAmount) }} (Brazilian reais). Your bank converts it to your currency — the final amount may vary slightly.</span>
        </div>

        <fieldset v-else class="amounts">
          <legend>Amount ({{ config?.currency ?? 'BRL' }})</legend>
          <div class="amounts__row">
            <button
              v-for="p in presets" :key="p" type="button" class="amt" :class="{ 'is-on': custom === '' && amount === p }"
              :aria-pressed="custom === '' && amount === p" @click="pickPreset(p)"
            >{{ money(p) }}</button>
          </div>
          <input
            v-model="custom" class="input" type="number" inputmode="decimal" step="0.01" :min="minAmount" :max="maxAmount"
            :placeholder="`Other amount (${money(minAmount)} – ${money(maxAmount)})`" aria-label="Other amount"
          />
        </fieldset>

        <button v-if="method === 'pix'" type="button" class="btn btn--gold btn--lg btn--block" :disabled="busy || !config" @click="startPix">
          <span v-if="busy" class="spinner" /> Generate Pix QR code · {{ priceLabel(chosenAmount) }}
        </button>

        <!-- Standard cc-* autocomplete names: the browser offers the cards it already saved. -->
        <form v-else class="cardform" autocomplete="on" novalidate @submit.prevent="payCard">
          <label class="field"><span>Name on card</span>
            <input v-model="card.holder" class="input" name="ccname" autocomplete="cc-name" autocapitalize="characters" spellcheck="false" maxlength="60" />
          </label>
          <label class="field"><span>Card number</span>
            <input
              :value="card.number" class="input" name="cardnumber" autocomplete="cc-number" inputmode="numeric" maxlength="23"
              placeholder="1234 5678 9012 3456" @input="card.number = formatCardNumber($event.target.value); $event.target.value = card.number"
            />
          </label>
          <div class="cardform__row">
            <label class="field"><span>Expiry</span>
              <input v-model="card.expiry" class="input" name="cc-exp" autocomplete="cc-exp" inputmode="numeric" maxlength="7" placeholder="MM/YY" />
            </label>
            <label class="field"><span>Security code</span>
              <input v-model="card.cvv" class="input" name="cvc" autocomplete="cc-csc" inputmode="numeric" maxlength="4" placeholder="CVV" type="password" />
            </label>
          </div>
          <label class="field"><span>CPF <small>(Brazilian cards only — optional)</small></span>
            <input v-model="card.docNumber" class="input" name="cpf" autocomplete="off" inputmode="numeric" maxlength="14" />
          </label>
          <button type="submit" class="btn btn--gold btn--lg btn--block" :disabled="busy || !config">
            <span v-if="busy" class="spinner" /> <AppIcon name="lock" :size="16" /> Donate {{ priceLabel(chosenAmount) }}
          </button>
          <p class="note">Card details go straight to Mercado Pago over an encrypted connection — our server never sees them.</p>
        </form>
      </template>
    </template>

    <template #footer>Supporting is optional and never required to play. <RouterLink :to="{ path: '/', hash: '#support' }">Learn more</RouterLink></template>
  </AuthLayout>
</template>

<style scoped>
.perks { list-style: none; padding: 0; margin: 0 0 22px; display: grid; gap: 8px; }
.perks li { display: flex; align-items: center; gap: 10px; color: var(--text-200); font-size: .92rem; }
.perks li svg { color: var(--gold-300); flex: none; }
.sup-chip { display: flex; align-items: center; gap: 8px; }
.region { display: flex; justify-content: space-between; align-items: center; gap: 12px; margin-bottom: 16px; font-size: .9rem; color: var(--text-200); }
.region span { display: inline-flex; align-items: center; gap: 8px; }
.linkish { background: none; border: 0; padding: 0; color: var(--ice-300); cursor: pointer; font: inherit; text-decoration: underline; }
.price { display: grid; justify-items: center; gap: 4px; margin: 0 0 20px; padding: 16px; border-radius: var(--radius); border: 1px solid rgba(233, 196, 106, .35); background: rgba(233, 196, 106, .06); text-align: center; }
.price__label { font-size: .8rem; letter-spacing: .12em; text-transform: uppercase; color: var(--text-300); }
.price__value { font: 700 2rem/1.1 var(--font-display); }
.price__note { font-size: .8rem; color: var(--text-400); max-width: 380px; }
.amounts { border: 0; padding: 0; margin: 0 0 20px; display: grid; gap: 10px; }
.amounts legend { font-size: .85rem; color: var(--text-300); margin-bottom: 8px; }
.amounts__row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
.amt { padding: 12px 6px; border-radius: var(--radius-sm); border: 1px solid var(--line-strong); background: var(--bg-850); color: var(--text-100); font-weight: 600; cursor: pointer; transition: border-color .2s, background .2s; }
.amt:hover { border-color: var(--gold-400); }
.amt.is-on { border-color: var(--gold-300); background: rgba(233, 196, 106, .12); color: var(--gold-100); }
.cardform { display: grid; gap: 4px; }
.cardform__row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.field > span { display: block; font-size: .85rem; color: var(--text-300); margin-bottom: 6px; }
.field small { color: var(--text-400); }
.note { font-size: .82rem; color: var(--text-400); margin: 10px 0 0; text-align: center; }
.pix { display: grid; gap: 14px; justify-items: center; }
.pix > * { width: 100%; }
.pix__amount { text-align: center; margin: 0; color: var(--text-200); }
.pix__qr { width: 240px !important; height: 240px; background: #fff; padding: 10px; border-radius: var(--radius); }
.pix__code { font-family: ui-monospace, monospace; font-size: .78rem; resize: none; word-break: break-all; }
.wait { display: flex; justify-content: center; align-items: center; gap: 10px; color: var(--ice-100); margin: 0; text-align: center; }
.wait-card { display: grid; gap: 14px; justify-items: center; padding: 20px 0; }
.done { display: grid; gap: 12px; text-align: center; justify-items: center; }
.done h2 { margin: 0; }
.done p { margin: 0; color: var(--text-200); }
.done__icon { width: 72px; height: 72px; display: grid; place-items: center; border-radius: 50%; background: rgba(95, 224, 160, .12); border: 1px solid var(--ok); color: var(--ok); }
.done__badge { display: inline-flex; align-items: center; gap: 8px; color: var(--gold-100) !important; }
.done .btn { margin-top: 8px; }
@media (max-width: 480px) {
  .amounts__row { grid-template-columns: repeat(2, 1fr); }
}
</style>
