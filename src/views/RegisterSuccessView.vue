<script setup>
import { ref, computed } from 'vue'
import AuthLayout from '../components/auth/AuthLayout.vue'
import AppIcon from '../components/ui/AppIcon.vue'
import { resendVerification } from '../services/accountService.js'
import { cooldownRemaining, markCooldown } from '../utils/botGuard.js'

const email = ref(typeof history !== 'undefined' ? history.state?.email ?? '' : '')
const masked = computed(() => email.value.replace(/^(.{2})[^@]*(@.*)$/, '$1•••$2'))
const state = ref('idle') // idle | sending | sent | error
const msg = ref('')

async function resend() {
  const wait = cooldownRemaining('resend', 60_000)
  if (wait) { state.value = 'error'; msg.value = `You can request another e-mail in ${Math.ceil(wait / 1000)}s.`; return }
  state.value = 'sending'
  try {
    await resendVerification({ email: email.value })
    markCooldown('resend')
    state.value = 'sent'
  } catch {
    state.value = 'error'; msg.value = 'Could not send the request. Please try again shortly.'
  }
}
</script>

<template>
  <AuthLayout title="Your Journey Begins" subtitle="Registration received.">
    <div class="ok">
      <div class="ok__icon"><AppIcon name="mail" :size="34" /></div>
      <p>
        We're preparing your account. A verification e-mail will be sent
        <template v-if="email"> to <strong>{{ masked }}</strong></template> shortly.
      </p>
      <ol class="ok__steps">
        <li>Open the e-mail from WoW Classic Plus LK.</li>
        <li>Click the verification link (limited validity, single use).</li>
        <li>Your game account is activated once our server confirms it.</li>
      </ol>
      <p class="ok__small">Didn't get it? Check your spam folder. If the username or e-mail is already taken, the e-mail will tell you.</p>

      <p v-if="state === 'sent'" class="alert alert--success" role="status">New verification e-mail requested.</p>
      <p v-else-if="state === 'error'" class="alert alert--error" role="alert">{{ msg }}</p>
      <button v-if="email && state !== 'sent'" type="button" class="btn btn--ghost btn--block" :disabled="state === 'sending'" @click="resend">
        <AppIcon name="refresh" /> Resend verification e-mail
      </button>
      <RouterLink v-else-if="!email" :to="{ name: 'verify-email' }" class="btn btn--ghost btn--block"><AppIcon name="refresh" /> Resend verification e-mail</RouterLink>
      <RouterLink to="/" class="btn btn--gold btn--block ok__home">Back to Home</RouterLink>
    </div>
  </AuthLayout>
</template>

<style scoped>
.ok { text-align: center; }
.ok__icon { width: 76px; height: 76px; margin: 0 auto 18px; display: grid; place-items: center; border-radius: 50%; color: var(--ok); background: radial-gradient(circle, rgba(95, 224, 160, .2), transparent 70%); border: 1px solid rgba(95, 224, 160, .4); }
.ok p { color: var(--text-200); }
.ok__steps { text-align: left; margin: 0 0 18px; padding: 16px 16px 16px 36px; border-radius: 4px; background: rgba(3, 6, 10, .5); border: 1px solid var(--line); color: var(--text-300); font-size: .92rem; display: grid; gap: 6px; }
.ok__small { font-size: .82rem; color: var(--text-400) !important; }
.ok__home { margin-top: 12px; }
</style>
