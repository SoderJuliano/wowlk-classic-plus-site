<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import AuthLayout from '../components/auth/AuthLayout.vue'
import TextField from '../components/auth/TextField.vue'
import HoneypotField from '../components/ui/HoneypotField.vue'
import AppIcon from '../components/ui/AppIcon.vue'
import { confirmEmail, resendVerification } from '../services/accountService.js'
import { createBotGuard, cooldownRemaining, markCooldown } from '../utils/botGuard.js'
import { validateEmail } from '../utils/validation.js'
import { isValidLink } from '../utils/linkParams.js'

const route = useRoute()
const username = computed(() => String(route.query.u ?? ''))
const token = computed(() => String(route.query.t ?? ''))
const hasLink = computed(() => isValidLink(username.value, token.value))

const state = ref('idle') // idle | sending | done | error
const error = ref('')
const email = ref('')
const website = ref('')
const guard = createBotGuard()

// Requires a click: e-mail link scanners prefetch URLs, so we never auto-submit.
async function confirm() {
  state.value = 'sending'
  try {
    await confirmEmail({ username: username.value, token: token.value })
    state.value = 'done'
  } catch {
    state.value = 'error'; error.value = 'We could not reach the account service. Please try again.'
  }
}

async function resend() {
  if (guard.isBot(website.value)) { state.value = 'done'; return }
  error.value = validateEmail(email.value)
  if (error.value) return
  const wait = cooldownRemaining('resend', 60_000)
  if (wait) { error.value = `Please wait ${Math.ceil(wait / 1000)}s.`; return }
  state.value = 'sending'
  try {
    await resendVerification({ email: email.value })
    markCooldown('resend')
    state.value = 'done'
  } catch {
    state.value = 'error'; error.value = 'Could not send the request. Please try again shortly.'
  }
}
</script>

<template>
  <AuthLayout v-if="hasLink" title="Verify Your E-mail" :subtitle="`Account ${username.toUpperCase()}`">
    <template v-if="state === 'done'">
      <p class="alert alert--success" role="status">
        Verification submitted. Our server validates the link and activates your account — usually within a few minutes.
        If the link has expired or was already used, you'll receive instructions by e-mail.
      </p>
      <RouterLink to="/" class="btn btn--gold btn--block">Back to Home</RouterLink>
    </template>
    <template v-else>
      <p class="lead">Confirm that this e-mail address belongs to you to activate your game account.</p>
      <p v-if="state === 'error'" class="alert alert--error" role="alert">{{ error }}</p>
      <button type="button" class="btn btn--gold btn--lg btn--block" :disabled="state === 'sending'" @click="confirm">
        <span v-if="state === 'sending'" class="spinner" /><AppIcon v-else name="check" /> Confirm my e-mail
      </button>
    </template>
  </AuthLayout>

  <AuthLayout v-else title="Verify Your E-mail" subtitle="Request a new verification link.">
    <p v-if="state === 'done'" class="alert alert--success" role="status">
      If an unverified account uses this address, a new verification e-mail is on its way.
    </p>
    <form v-else novalidate @submit.prevent="resend">
      <HoneypotField v-model="website" />
      <p v-if="route.query.t !== undefined" class="alert alert--info">This verification link is incomplete or invalid. Request a new one below.</p>
      <TextField v-model="email" label="E-mail" type="email" autocomplete="email" :error="error" />
      <button type="submit" class="btn btn--gold btn--block" :disabled="state === 'sending'">
        <span v-if="state === 'sending'" class="spinner" /> Send new link
      </button>
    </form>
    <template #footer><RouterLink :to="{ name: 'login' }">Back to login</RouterLink></template>
  </AuthLayout>
</template>

<style scoped>
.lead { text-align: center; color: var(--text-300); }
</style>
