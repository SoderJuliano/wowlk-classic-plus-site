<script setup>
import { ref, watch, computed, nextTick } from 'vue'
import { useDownloadModal } from '../../composables/useDownloadModal.js'
import { site } from '../../config/site.js'
import { subscribeToDownloads } from '../../services/accountService.js'
import { createBotGuard } from '../../utils/botGuard.js'
import { validateEmail } from '../../utils/validation.js'
import AppIcon from './AppIcon.vue'
import StageBadge from './StageBadge.vue'
import HoneypotField from './HoneypotField.vue'

const { state, close } = useDownloadModal()
const dialog = ref(null)
const email = ref('')
const website = ref('')
const status = ref('idle') // idle | sending | done | error
const error = ref('')
let guard = createBotGuard()

const client = computed(() => (state.clientId ? site.downloads[state.clientId] : null))

watch(
  () => state.open,
  async (open) => {
    await nextTick()
    const el = dialog.value
    if (!el) return
    if (open && !el.open) {
      status.value = 'idle'; error.value = ''; guard = createBotGuard()
      el.showModal()
    } else if (!open && el.open) el.close()
  }
)

async function notify() {
  if (guard.isBot(website.value)) { status.value = 'done'; return } // silent drop, no request
  error.value = validateEmail(email.value)
  if (error.value) return
  status.value = 'sending'
  try {
    await subscribeToDownloads({ email: email.value })
    status.value = 'done'
  } catch {
    status.value = 'error'
    error.value = 'We could not save your request right now. Please try again in a moment.'
  }
}

function onBackdrop(e) { if (e.target === dialog.value) close() }
</script>

<template>
  <dialog ref="dialog" class="dlg" aria-labelledby="dlg-title" @close="close" @click="onBackdrop">
    <div class="dlg__box panel panel--frost">
      <button class="dlg__x" type="button" aria-label="Close" @click="close"><AppIcon name="close" :size="20" /></button>

      <div class="dlg__icon"><AppIcon name="snowflake" :size="34" /></div>
      <p class="eyebrow">Downloads</p>
      <h2 id="dlg-title" class="dlg__title gold-text">The gates are not open yet</h2>

      <p v-if="client" class="dlg__client">
        {{ client.title }} <StageBadge :value="client.status" />
      </p>
      <p class="dlg__msg">
        Game downloads are being prepared. Create your account to receive an email notification
        when the game becomes available.
      </p>

      <RouterLink class="btn btn--gold btn--block" :to="{ name: 'register' }" @click="close">
        <AppIcon name="user" /> Create Account
      </RouterLink>

      <div class="dlg__sep"><span>or just notify me</span></div>

      <p v-if="status === 'done'" class="alert alert--success" role="status">
        Done — we'll e-mail you as soon as the files are published.
      </p>
      <form v-else class="dlg__form" novalidate @submit.prevent="notify">
        <HoneypotField v-model="website" />
        <label class="sr-only" for="dlg-email">E-mail address</label>
        <input
          id="dlg-email" v-model="email" class="input" type="email" autocomplete="email"
          placeholder="your@email.com" :aria-invalid="!!error" aria-describedby="dlg-err"
        />
        <button class="btn btn--ghost" type="submit" :disabled="status === 'sending'">
          <span v-if="status === 'sending'" class="spinner" /> <template v-else>Notify me</template>
        </button>
      </form>
      <p v-if="error" id="dlg-err" class="field-error" role="alert">{{ error }}</p>
    </div>
  </dialog>
</template>

<style scoped>
.dlg { padding: 0; border: 0; background: transparent; max-width: min(520px, calc(100% - 32px)); width: 100%; color: inherit; overflow: visible; }
.dlg::backdrop { background: rgba(2, 5, 9, .78); backdrop-filter: blur(6px); }
.dlg[open] { animation: pop .35s var(--ease); }
@keyframes pop { from { opacity: 0; transform: translateY(14px) scale(.98); } }
.dlg__box { text-align: center; padding: 40px clamp(22px, 5vw, 40px) 32px; box-shadow: 0 0 80px -20px var(--ice-glow), 0 30px 80px rgba(0, 0, 0, .7); }
.dlg__x { position: absolute; top: 12px; right: 12px; background: none; border: 0; color: var(--text-300); cursor: pointer; padding: 6px; border-radius: 4px; }
.dlg__x:hover { color: #fff; }
.dlg__icon { width: 68px; height: 68px; margin: 0 auto 14px; display: grid; place-items: center; border-radius: 50%; color: var(--ice-200); background: radial-gradient(circle, rgba(79, 179, 247, .25), transparent 70%); border: 1px solid var(--line-strong); }
.dlg__title { font-size: clamp(1.4rem, 3vw, 1.8rem); }
.dlg__client { display: flex; gap: 10px; justify-content: center; align-items: center; flex-wrap: wrap; color: var(--text-100); font-weight: 600; font-size: .92rem; }
.dlg__msg { color: var(--text-300); margin-bottom: 24px; }
.dlg__sep { display: flex; align-items: center; gap: 12px; margin: 22px 0 16px; color: var(--text-400); font-size: .75rem; letter-spacing: .16em; text-transform: uppercase; }
.dlg__sep::before, .dlg__sep::after { content: ''; flex: 1; height: 1px; background: var(--line); }
.dlg__form { display: flex; gap: 10px; }
.dlg__form .input { flex: 1; }
.dlg__form .btn { --h: 48px; }
.field-error { margin-top: 8px; }
@media (max-width: 460px) { .dlg__form { flex-direction: column; } }
</style>
