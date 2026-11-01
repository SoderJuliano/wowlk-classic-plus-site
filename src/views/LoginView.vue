<script setup>
import { reactive, ref } from 'vue'
import AuthLayout from '../components/auth/AuthLayout.vue'
import TextField from '../components/auth/TextField.vue'
import HoneypotField from '../components/ui/HoneypotField.vue'
import { login, isLoginAvailable } from '../services/accountService.js'
import { createBotGuard } from '../utils/botGuard.js'

const form = reactive({ login: '', password: '' })
const website = ref('')
const busy = ref(false)
const error = ref('')
const success = ref(false)
const available = isLoginAvailable()
const guard = createBotGuard()

async function submit() {
  if (guard.isBot(website.value)) return
  error.value = ''
  if (!form.login.trim() || !form.password) { error.value = 'Enter your username or e-mail and your password.'; return }
  busy.value = true
  try {
    await login(form)
    success.value = true
  } catch (e) {
    // Generic by design — never reveal whether an account exists.
    error.value = e.code === 'LOGIN_UNAVAILABLE' || e.code === 'RATE_LIMITED' ? e.message : 'Invalid username/e-mail or password.'
  } finally {
    busy.value = false
    form.password = ''
  }
}
</script>

<template>
  <AuthLayout title="Welcome Back" subtitle="Log in to your account.">
    <p v-if="!available" class="alert alert--info">
      The account portal opens with the official launch. Once verified, your account already works in the game.
    </p>
    <p v-if="success" class="alert alert--success" role="status">Logged in.</p>

    <form novalidate @submit.prevent="submit">
      <HoneypotField v-model="website" />
      <p v-if="error" class="alert alert--error" role="alert">{{ error }}</p>
      <TextField v-model="form.login" label="Username or e-mail" autocomplete="username" name="login" />
      <TextField v-model="form.password" label="Password" type="password" autocomplete="current-password" name="password" :maxlength="16" />
      <div class="meta"><RouterLink :to="{ name: 'forgot-password' }">Forgot your password?</RouterLink></div>
      <button type="submit" class="btn btn--gold btn--lg btn--block" :disabled="busy">
        <span v-if="busy" class="spinner" /> Log In
      </button>
    </form>

    <template #footer>New to Northrend? <RouterLink :to="{ name: 'register' }">Create an account</RouterLink></template>
  </AuthLayout>
</template>

<style scoped>
.meta { display: flex; justify-content: flex-end; margin: -6px 0 18px; font-size: .86rem; }
</style>
