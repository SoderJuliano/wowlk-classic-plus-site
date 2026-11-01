<script setup>
import { ref } from 'vue'
import AuthLayout from '../components/auth/AuthLayout.vue'
import TextField from '../components/auth/TextField.vue'
import HoneypotField from '../components/ui/HoneypotField.vue'
import { requestPasswordReset } from '../services/accountService.js'
import { createBotGuard, cooldownRemaining, markCooldown } from '../utils/botGuard.js'
import { validateEmail } from '../utils/validation.js'

const email = ref('')
const website = ref('')
const error = ref('')
const state = ref('idle')
const guard = createBotGuard()

async function submit() {
  if (guard.isBot(website.value)) { state.value = 'done'; return }
  error.value = validateEmail(email.value)
  if (error.value) return
  const wait = cooldownRemaining('reset', 60_000)
  if (wait) { error.value = `Please wait ${Math.ceil(wait / 1000)}s before requesting again.`; return }
  state.value = 'sending'
  try {
    await requestPasswordReset({ email: email.value })
    markCooldown('reset')
    state.value = 'done'
  } catch {
    state.value = 'idle'
    error.value = 'We could not reach the account service. Please try again in a few minutes.'
  }
}
</script>

<template>
  <AuthLayout title="Recover Your Account" subtitle="We'll e-mail you a secure reset link.">
    <p v-if="state === 'done'" class="alert alert--success" role="status">
      If an account is registered with this address, you'll receive a password reset link shortly.
      The link is valid for a limited time and can be used only once.
    </p>
    <form v-else novalidate @submit.prevent="submit">
      <HoneypotField v-model="website" />
      <TextField v-model="email" label="E-mail" type="email" autocomplete="email" name="email" :error="error" />
      <button type="submit" class="btn btn--gold btn--lg btn--block" :disabled="state === 'sending'">
        <span v-if="state === 'sending'" class="spinner" /> Send reset link
      </button>
    </form>
    <template #footer><RouterLink :to="{ name: 'login' }">Back to login</RouterLink></template>
  </AuthLayout>
</template>
