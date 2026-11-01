<script setup>
import { reactive, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import AuthLayout from '../components/auth/AuthLayout.vue'
import TextField from '../components/auth/TextField.vue'
import { resetPassword } from '../services/accountService.js'
import { RULES, validatePassword, validatePasswordConfirm } from '../utils/validation.js'
import { isValidLink } from '../utils/linkParams.js'

const route = useRoute()
const username = computed(() => String(route.query.u ?? ''))
const token = computed(() => String(route.query.t ?? ''))
const valid = computed(() => isValidLink(username.value, token.value))

const form = reactive({ password: '', confirm: '' })
const submitted = ref(false)
const state = ref('idle')
const error = ref('')
const errors = computed(() => ({
  password: validatePassword(form.password, username.value),
  confirm: validatePasswordConfirm(form.password, form.confirm)
}))

async function submit() {
  submitted.value = true
  if (errors.value.password || errors.value.confirm) return
  state.value = 'sending'
  try {
    await resetPassword({ username: username.value, token: token.value, password: form.password })
    state.value = 'done'
    form.password = ''; form.confirm = ''
  } catch {
    state.value = 'idle'; error.value = 'We could not reach the account service. Please try again.'
  }
}
</script>

<template>
  <AuthLayout title="Choose a New Password" :subtitle="valid ? `Account ${username.toUpperCase()}` : ''">
    <template v-if="!valid">
      <p class="alert alert--error">This reset link is invalid or incomplete.</p>
      <RouterLink :to="{ name: 'forgot-password' }" class="btn btn--gold btn--block">Request a new link</RouterLink>
    </template>
    <template v-else-if="state === 'done'">
      <p class="alert alert--success" role="status">
        Request received. Your new password takes effect as soon as our server validates the reset link.
        If the link expired or was already used, you'll get an e-mail with instructions.
      </p>
      <RouterLink :to="{ name: 'login' }" class="btn btn--gold btn--block">Back to login</RouterLink>
    </template>
    <form v-else novalidate @submit.prevent="submit">
      <p v-if="error" class="alert alert--error" role="alert">{{ error }}</p>
      <TextField
        v-model="form.password" label="New password" type="password" autocomplete="new-password" :maxlength="RULES.passwordMax"
        :error="submitted ? errors.password : ''" :hint="`${RULES.passwordMin}–${RULES.passwordMax} characters, letters and numbers.`"
      />
      <TextField
        v-model="form.confirm" label="Confirm new password" type="password" autocomplete="new-password"
        :maxlength="RULES.passwordMax" :error="submitted ? errors.confirm : ''"
      />
      <button type="submit" class="btn btn--gold btn--lg btn--block" :disabled="state === 'sending'">
        <span v-if="state === 'sending'" class="spinner" /> Update password
      </button>
    </form>
  </AuthLayout>
</template>
