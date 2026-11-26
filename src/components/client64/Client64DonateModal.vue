<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import AppIcon from '../ui/AppIcon.vue'
import { session } from '../../services/session.js'
import {
  isDonationAvailable, getClient64DonationConfig, createClient64PixPayment, createClient64CardPayment,
  getClient64Payment, simulateWebhook, newIdempotencyKey, refreshClient64Supporter, client64Supporter,
  detectRegion, methodForRegion, tokenizeCard, formatCardNumber, rejectionMessage, onlyDigits
} from '../../services/donationService.js'
import { site } from '../../config/site.js'

const props = defineProps({
  open: { type: Boolean, default: false }
})
const emit = defineEmits(['close'])

const available = computed(() => isDonationAvailable())
const config = ref(null)
const configError = ref('')

const region = ref(detectRegion())
const isPt = computed(() => region.value === 'BR')
const method = computed(() => methodForRegion(region.value))

const fixedAmount = computed(() => Number(config.value?.fixedAmount ?? 99.9))
const usdEquivalent = computed(() => (config.value?.usdEquivalent != null ? Number(config.value.usdEquivalent) : 16.82))

const card = reactive({ holder: '', number: '', expiry: '', cvv: '', docNumber: '' })

/** idle → pending → done | failed */
const phase = ref('idle')
const busy = ref(false)
const error = ref('')
const payment = ref(null)
const copied = ref(false)
const now = ref(Date.now())
let idempotencyKey = newIdempotencyKey()
let pollTimer = null
let clockTimer = null

const money = (v) => new Intl.NumberFormat(isPt.value ? 'pt-BR' : 'en-US', {
  style: 'currency',
  currency: config.value?.currency ?? 'BRL'
}).format(Number(v) || 0)
const usd = (v) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(v) || 0)
const priceLabel = (v) => (!isPt.value && usdEquivalent.value != null
  ? `${usd(usdEquivalent.value)} (${money(v)})`
  : money(v))

const expiresIn = computed(() => {
  const at = payment.value?.pix?.expiresAt
  if (!at) return ''
  const s = Math.max(0, Math.floor((Date.parse(at) - now.value) / 1000))
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
})
const pixExpired = computed(() => payment.value?.pix?.expiresAt && Date.parse(payment.value.pix.expiresAt) <= now.value)
const since = computed(() => client64Supporter.value?.since ? new Date(client64Supporter.value.since).toLocaleDateString() : '')

async function loadConfig() {
  if (!available.value || config.value) return
  configError.value = ''
  try {
    config.value = await getClient64DonationConfig()
  } catch (e) {
    configError.value = e.message
  }
}

function onKeydown(e) {
  if (e.key === 'Escape' && props.open) close()
}

onMounted(() => {
  clockTimer = setInterval(() => { now.value = Date.now() }, 1000)
  window.addEventListener('keydown', onKeydown)
  if (props.open) {
    loadConfig()
    if (session.value) refreshClient64Supporter()
  }
})
onBeforeUnmount(() => {
  stopPolling()
  clearInterval(clockTimer)
  window.removeEventListener('keydown', onKeydown)
  document.body.style.removeProperty('overflow')
})

watch(() => props.open, (v) => {
  if (typeof document !== 'undefined') {
    document.body.style.setProperty('overflow', v ? 'hidden' : '')
  }
  if (v) {
    loadConfig()
    if (session.value) refreshClient64Supporter()
  } else {
    stopPolling()
  }
})

watch(() => session.value?.username, () => {
  if (session.value && props.open) refreshClient64Supporter({ force: true })
})

function close() {
  stopPolling()
  emit('close')
}

function switchRegion() {
  if (phase.value !== 'pending') {
    region.value = region.value === 'BR' ? 'INTL' : 'BR'
    error.value = ''
  }
}

async function startPix() {
  error.value = ''
  busy.value = true
  try {
    payment.value = await createClient64PixPayment(idempotencyKey)
    phase.value = 'pending'
    poll()
  } catch (e) {
    error.value = e.message
    if (e.status) idempotencyKey = newIdempotencyKey()
  } finally {
    busy.value = false
  }
}

async function payCard() {
  error.value = ''
  busy.value = true
  try {
    const t = await tokenizeCard(config.value, card)
    const p = await createClient64CardPayment({
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
  idempotencyKey = newIdempotencyKey()
  error.value = message
  phase.value = 'failed'
}

function stopPolling() {
  clearTimeout(pollTimer)
  pollTimer = null
}

function poll() {
  stopPolling()
  pollTimer = setTimeout(async () => {
    try {
      const p = await getClient64Payment(payment.value.id)
      payment.value = { ...payment.value, ...p, pix: p.pix ?? payment.value.pix }
      if (p.recorded || p.status === 'approved') {
        phase.value = 'done'
        refreshClient64Supporter({ force: true })
        return
      }
      if (['rejected', 'cancelled', 'refunded', 'charged_back'].includes(p.status)) {
        fail(p.method === 'pix'
          ? (isPt.value ? 'Este código Pix expirou ou foi cancelado. Gere um novo.' : 'This Pix code expired or was cancelled. Generate a new one.')
          : rejectionMessage(p.statusDetail))
        return
      }
    } catch (e) {
      if (e.code === 'SESSION_EXPIRED') { fail(e.message); return }
    }
    if (pixExpired.value && payment.value.status !== 'approved') {
      fail(isPt.value ? 'Este código Pix expirou. Gere um novo.' : 'This Pix code expired. Generate a new one.')
      return
    }
    poll()
  }, site.donation.pollMs)
}

async function copyCode() {
  try {
    await navigator.clipboard.writeText(payment.value.pix.qrCode)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2500)
  } catch { /* selectable fallback */ }
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
  <Teleport to="body">
    <div v-if="open" class="m64" role="dialog" aria-modal="true" aria-labelledby="m64-title" @click.self="close">
      <div class="m64__box panel panel--frost">
        <header class="m64__head">
          <div>
            <p class="eyebrow">{{ isPt ? 'Cliente 64-bit · Apoio voluntário' : '64-bit Client · Voluntary support' }}</p>
            <h2 id="m64-title" class="gold-text">{{ isPt ? 'Me pague uma pizza :D' : 'Buy me a pizza :D' }}</h2>
          </div>
          <button type="button" class="m64__close" :aria-label="isPt ? 'Fechar' : 'Close'" @click="close">
            <AppIcon name="close" :size="20" />
          </button>
        </header>

        <p class="m64__lead">
          {{ isPt
            ? 'Toda doação é convertida em tokens para melhorar e acelerar o desenvolvimento do cliente 64-bit.'
            : 'Every donation is converted into tokens to improve and speed up development of the 64-bit client.' }}
        </p>

        <p v-if="!available" class="alert alert--info">
          {{ isPt ? 'As doações não estão disponíveis no momento. Obrigado por querer ajudar!' : 'Donations are not available yet. Thank you for wanting to help!' }}
        </p>

        <!-- Login / Registration gate (mandatory to identify the player) -->
        <div v-else-if="!session" class="m64__auth">
          <div class="m64__auth-box">
            <AppIcon name="lock" :size="24" class="m64__auth-icon" />
            <div>
              <h3>{{ isPt ? 'Faça login ou crie sua conta para continuar' : 'Log in or create an account to continue' }}</h3>
              <p>
                {{ isPt
                  ? 'Essa é a única maneira de registrar o seu interesse no cliente 64-bit — precisamos saber quem é o player para vincular sua contribuição e enviar a confirmação por e-mail.'
                  : 'This is the only way to register your interest in the 64-bit client — we need to know who the player is so we can link your contribution and send your confirmation e-mail.' }}
              </p>
            </div>
          </div>
          <div class="m64__auth-actions">
            <RouterLink :to="{ name: 'login', query: { redirect: '/client-64?donate=1' } }" class="btn btn--gold btn--lg" @click="close">
              <AppIcon name="lock" :size="16" /> {{ isPt ? 'Fazer Login' : 'Log In' }}
            </RouterLink>
            <RouterLink :to="{ name: 'register' }" class="btn btn--frost btn--lg" @click="close">
              <AppIcon name="user" :size="16" /> {{ isPt ? 'Criar Conta' : 'Create Account' }}
            </RouterLink>
          </div>
        </div>

        <!-- Logged-in checkout flow -->
        <template v-else>
          <p class="m64__who">
            <AppIcon name="user" :size="15" />
            <span>{{ isPt ? 'Contribuindo como' : 'Contributing as' }} <strong>{{ session.username }}</strong></span>
          </p>

          <p v-if="client64Supporter?.supporter && phase !== 'done'" class="alert alert--success m64__chip" role="status">
            <AppIcon name="sparkles" :size="18" />
            <span>
              {{ isPt ? 'Seu apoio ao Cliente 64-bit já está registrado' : 'Your 64-bit Client support is already registered' }}<span v-if="since"> ({{ since }})</span>. {{ isPt ? 'Muito obrigado!' : 'Thank you!' }}
            </span>
          </p>

          <p v-if="configError" class="alert alert--error" role="alert">{{ configError }}</p>

          <!-- Success -->
          <div v-if="phase === 'done'" class="done" role="status">
            <div class="done__icon"><AppIcon name="check" :size="40" /></div>
            <h3 class="gold-text">{{ isPt ? 'Doação confirmada! Muito obrigado!' : 'Donation confirmed! Thank you!' }}</h3>
            <p>
              {{ isPt
                ? `Recebemos sua contribuição de ${priceLabel(payment.amount)} e registramos sua conta (${session.username}) na lista do Cliente 64-bit.`
                : `We received your ${priceLabel(payment.amount)} contribution and registered your account (${session.username}) on our 64-bit Client list.` }}
            </p>
            <p class="done__mail">
              <AppIcon name="mail" :size="16" />
              <span>
                {{ isPt
                  ? 'Enviamos um e-mail de agradecimento para o endereço da sua conta. Fique de olho no launcher para novidades futuras — bom jogo!'
                  : 'We sent a thank-you e-mail to your account address. Keep an eye on the launcher for future updates — have fun!' }}
              </span>
            </p>
            <button type="button" class="btn btn--gold btn--block" @click="close">
              {{ isPt ? 'Voltar para o Cliente 64-bit' : 'Back to 64-bit Client' }}
            </button>
          </div>

          <!-- Pix waiting -->
          <div v-else-if="phase === 'pending' && payment?.method === 'pix'" class="pix">
            <p class="pix__amount">Pix · <strong>{{ money(payment.amount) }}</strong></p>
            <img v-if="payment.pix?.qrCodeImage" :src="payment.pix.qrCodeImage" alt="Pix QR code" class="pix__qr" width="220" height="220" />
            <label class="field">
              <span>{{ isPt ? 'Código Pix copia e cola' : 'Pix copy-and-paste code' }}</span>
              <textarea class="input pix__code" readonly rows="3" :value="payment.pix?.qrCode" @focus="$event.target.select()" />
            </label>
            <button type="button" class="btn btn--frost btn--block" @click="copyCode">
              <AppIcon :name="copied ? 'check' : 'layers'" :size="16" />
              {{ copied ? (isPt ? 'Copiado!' : 'Copied!') : (isPt ? 'Copiar código' : 'Copy code') }}
            </button>
            <p class="wait" role="status" aria-live="polite">
              <span class="spinner" />
              {{ isPt ? 'Aguardando confirmação do pagamento' : 'Waiting for payment confirmation' }}<span v-if="expiresIn"> · {{ isPt ? 'expira em' : 'expires in' }} {{ expiresIn }}</span>
            </p>
            <p class="note">
              {{ isPt
                ? 'Abra o app do seu banco, escolha Pix e escaneie o QR code. Esta janela atualiza sozinha assim que o Mercado Pago confirmar.'
                : 'Open your bank app, choose Pix and scan the code. This window updates automatically as soon as Mercado Pago confirms.' }}
            </p>
            <div class="pix__btns">
              <button v-if="config?.devTools" type="button" class="btn btn--ghost btn--sm" @click="simulate">Simulate payment (dev)</button>
              <button type="button" class="btn btn--ghost btn--sm" @click="reset">{{ isPt ? 'Cancelar' : 'Cancel' }}</button>
            </div>
          </div>

          <!-- Card processing -->
          <div v-else-if="phase === 'pending'" class="wait-card" role="status" aria-live="polite">
            <p class="wait">
              <span class="spinner" />
              {{ payment?.status === 'approved'
                ? (isPt ? 'Pagamento aprovado — registrando sua doação…' : 'Payment approved — registering your donation…')
                : (isPt ? 'Processando seu pagamento…' : 'Processing your payment…') }}
            </p>
            <button v-if="config?.devTools" type="button" class="btn btn--ghost btn--sm" @click="simulate">Deliver webhook (dev)</button>
          </div>

          <!-- Payment form -->
          <template v-else>
            <p v-if="error" class="alert alert--error" role="alert">{{ error }}</p>

            <div class="region">
              <span>
                <AppIcon name="globe" :size="16" />
                {{ isPt ? 'Brasil — pagamento via Pix' : 'Outside Brazil — pay with card' }}
              </span>
              <button type="button" class="linkish" @click="switchRegion">
                {{ isPt ? 'Fora do Brasil?' : 'In Brazil?' }}
              </button>
            </div>

            <div class="price">
              <span class="price__label">{{ isPt ? 'Contribuição fixa · Cliente 64-bit' : 'Fixed contribution · 64-bit Client' }}</span>
              <strong class="price__value gold-text">{{ isPt ? money(fixedAmount) : `≈ ${usd(usdEquivalent)}` }}</strong>
              <span v-if="!isPt" class="price__note">
                Charged as {{ money(fixedAmount) }} (Brazilian reais) via Mercado Pago. Your bank converts it to your currency.
              </span>
            </div>

            <button v-if="method === 'pix'" type="button" class="btn btn--gold btn--lg btn--block" :disabled="busy || !config" @click="startPix">
              <span v-if="busy" class="spinner" />
              {{ isPt ? `Gerar QR Code Pix · ${money(fixedAmount)}` : `Generate Pix QR code · ${priceLabel(fixedAmount)}` }}
            </button>

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
                <span v-if="busy" class="spinner" /> <AppIcon name="lock" :size="16" /> Donate {{ priceLabel(fixedAmount) }}
              </button>
              <p class="note">Card details go straight to Mercado Pago over an encrypted connection — our server never sees them.</p>
            </form>
          </template>
        </template>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.m64 {
  position: fixed; inset: 0; z-index: 90;
  display: grid; place-items: center; padding: 20px;
  background: rgba(2, 6, 12, .82); backdrop-filter: blur(8px);
  overflow-y: auto;
}
.m64__box {
  width: min(540px, 100%); max-height: calc(100dvh - 40px); overflow-y: auto;
  padding: 28px; display: grid; gap: 16px;
  background: linear-gradient(180deg, rgba(11, 24, 38, .98), rgba(6, 12, 20, .98));
  box-shadow: 0 24px 80px rgba(0, 0, 0, .85), 0 0 0 1px rgba(127, 203, 255, .24);
}
.m64__head { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; }
.m64__head h2 { margin: 4px 0 0; font-size: 1.7rem; }
.m64__close {
  background: rgba(255, 255, 255, .05); border: 1px solid var(--line-strong); border-radius: 6px;
  color: var(--text-200); padding: 6px; cursor: pointer; display: grid; place-items: center;
}
.m64__close:hover { color: var(--text-100); border-color: var(--ice-300); }
.m64__lead { margin: 0; color: var(--text-200); font-size: .94rem; }
.m64__who {
  display: inline-flex; align-items: center; gap: 8px; margin: 0;
  font-size: .88rem; color: var(--ice-100);
}
.m64__chip { display: flex; align-items: center; gap: 10px; margin: 0; }
.m64__auth { display: grid; gap: 16px; }
.m64__auth-box {
  display: flex; gap: 14px; align-items: flex-start; padding: 16px;
  border-radius: var(--radius); border: 1px solid rgba(233, 196, 106, .35);
  background: rgba(233, 196, 106, .08);
}
.m64__auth-icon { flex: none; color: var(--gold-300); margin-top: 2px; }
.m64__auth-box h3 { margin: 0 0 6px; font-size: 1.05rem; color: var(--gold-100); }
.m64__auth-box p { margin: 0; font-size: .9rem; color: var(--text-200); line-height: 1.5; }
.m64__auth-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.region { display: flex; justify-content: space-between; align-items: center; gap: 12px; font-size: .9rem; color: var(--text-200); }
.region span { display: inline-flex; align-items: center; gap: 8px; }
.linkish { background: none; border: 0; padding: 0; color: var(--ice-300); cursor: pointer; font: inherit; text-decoration: underline; }
.price {
  display: grid; justify-items: center; gap: 4px; padding: 16px;
  border-radius: var(--radius); border: 1px solid rgba(233, 196, 106, .35);
  background: rgba(233, 196, 106, .06); text-align: center;
}
.price__label { font-size: .78rem; letter-spacing: .12em; text-transform: uppercase; color: var(--text-300); }
.price__value { font: 700 2rem/1.1 var(--font-display); }
.price__note { font-size: .8rem; color: var(--text-400); max-width: 380px; }
.cardform { display: grid; gap: 8px; }
.cardform__row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.field > span { display: block; font-size: .85rem; color: var(--text-300); margin-bottom: 6px; }
.field small { color: var(--text-400); }
.note { font-size: .82rem; color: var(--text-400); margin: 4px 0 0; text-align: center; }
.pix { display: grid; gap: 12px; justify-items: center; }
.pix > * { width: 100%; }
.pix__amount { text-align: center; margin: 0; color: var(--text-200); }
.pix__qr { width: 220px !important; height: 220px; background: #fff; padding: 10px; border-radius: var(--radius); }
.pix__code { font-family: ui-monospace, monospace; font-size: .78rem; resize: none; word-break: break-all; }
.pix__btns { display: flex; justify-content: center; gap: 10px; }
.wait { display: flex; justify-content: center; align-items: center; gap: 10px; color: var(--ice-100); margin: 0; text-align: center; }
.wait-card { display: grid; gap: 14px; justify-items: center; padding: 20px 0; }
.done { display: grid; gap: 12px; text-align: center; justify-items: center; }
.done h3 { margin: 0; font-size: 1.4rem; }
.done p { margin: 0; color: var(--text-200); font-size: .94rem; }
.done__icon {
  width: 68px; height: 68px; display: grid; place-items: center; border-radius: 50%;
  background: rgba(95, 224, 160, .12); border: 1px solid var(--ok); color: var(--ok);
}
.done__mail {
  display: flex; align-items: flex-start; gap: 10px; text-align: left;
  padding: 12px 14px; border-radius: var(--radius-sm);
  background: rgba(79, 179, 247, .08); border: 1px solid var(--line); color: var(--ice-100) !important;
}
.done__mail svg { flex: none; margin-top: 2px; color: var(--ice-300); }
@media (max-width: 520px) {
  .m64__box { padding: 20px 16px; }
  .m64__auth-actions { grid-template-columns: 1fr; }
}
</style>
