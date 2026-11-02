<script setup>
import { computed, reactive, ref } from 'vue'
import AuthLayout from '../components/auth/AuthLayout.vue'
import TextField from '../components/auth/TextField.vue'
import HoneypotField from '../components/ui/HoneypotField.vue'
import { recoverPassword } from '../services/accountService.js'
import { createBotGuard, cooldownRemaining, markCooldown } from '../utils/botGuard.js'
import { RULES, validateEmail, validatePassword, validatePasswordConfirm, validateUsername } from '../utils/validation.js'

const form = reactive({ username: '', email: '', password: '', confirm: '' })
const website = ref('')
const submitted = ref(false)
const error = ref('')
const state = ref('idle')
const guard = createBotGuard()

const errors = computed(() => ({
  username: validateUsername(form.username),
  email: validateEmail(form.email),
  password: validatePassword(form.password, form.username),
  confirm: validatePasswordConfirm(form.password, form.confirm)
}))

async function submit() {
  if (guard.isBot(website.value)) { state.value = 'done'; return }
  submitted.value = true
  error.value = ''
  if (Object.values(errors.value).some(Boolean)) return
  const wait = cooldownRemaining('recover', 60_000)
  if (wait) { error.value = `Please wait ${Math.ceil(wait / 1000)}s before trying again.`; return }
  state.value = 'sending'
  try {
    await recoverPassword(form)
    markCooldown('recover')
    state.value = 'done'
    form.password = ''
    form.confirm = ''
  } catch {
    state.value = 'idle'
    error.value = 'We could not reach the account service. Please try again in a few minutes.'
  }
}
</script>

<template>
  <AuthLayout title="Recover Your Account" subtitle="Choose a new password.">
    <template v-if="state === 'done'">
      <p class="alert alert--success" role="status">
        Request received. If the username and e-mail match an account, your new password will work in about 2 minutes.
        Until then, your old password keeps working.
      </p>
      <RouterLink :to="{ name: 'login' }" class="btn btn--gold btn--block">Back to login</RouterLink>
    </template>
    <form v-else novalidate @submit.prevent="submit">
      <HoneypotField v-model="website" />
      <p v-if="error" class="alert alert--error" role="alert">{{ error }}</p>
      <TextField v-model="form.username" label="Username" autocomplete="username" name="username" :maxlength="RULES.usernameMax" :error="submitted ? errors.username : ''" />
      <TextField v-model="form.email" label="Account e-mail" type="email" autocomplete="email" name="email" :maxlength="RULES.emailMax" :error="submitted ? errors.email : ''" />
      <TextField v-model="form.password" label="New password" type="password" autocomplete="new-password" name="password" :maxlength="RULES.passwordMax" :error="submitted ? errors.password : ''" />
      <TextField v-model="form.confirm" label="Confirm new password" type="password" autocomplete="new-password" name="confirm" :maxlength="RULES.passwordMax" :error="submitted ? errors.confirm : ''" />
      <button type="submit" class="btn btn--gold btn--lg btn--block" :disabled="state === 'sending'">
        <span v-if="state === 'sending'" class="spinner" /> Change password
      </button>
    </form>
    <template #footer><RouterLink :to="{ name: 'login' }">Back to login</RouterLink></template>
  </AuthLayout>
</template>
