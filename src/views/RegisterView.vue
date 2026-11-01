<script setup>
import { reactive, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import AuthLayout from '../components/auth/AuthLayout.vue'
import TextField from '../components/auth/TextField.vue'
import HoneypotField from '../components/ui/HoneypotField.vue'
import AppIcon from '../components/ui/AppIcon.vue'
import { registerAccount } from '../services/accountService.js'
import { createBotGuard, cooldownRemaining, markCooldown } from '../utils/botGuard.js'
import { RULES, passwordChecks, passwordStrength, validateRegistration } from '../utils/validation.js'

const router = useRouter()
const form = reactive({ username: '', email: '', emailConfirm: '', password: '', passwordConfirm: '', terms: false, notifyDownloads: true })
const website = ref('') // honeypot
const touched = reactive({})
const submitted = ref(false)
const busy = ref(false)
const serverError = ref('')
const guard = createBotGuard()

const result = computed(() => validateRegistration(form))
const show = (k) => (submitted.value || touched[k] ? result.value.errors[k] : '')
const checks = computed(() => passwordChecks(form.password, form.username))
const strength = computed(() => passwordStrength(form.password))
const STRENGTH = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong']

async function submit() {
  // 1) Anti-bot gate — before ANY network call. Silent: looks like success to the bot.
  if (guard.isBot(website.value)) {
    router.push({ name: 'register-success' })
    return
  }
  submitted.value = true
  serverError.value = ''
  if (!result.value.valid) {
    document.querySelector('[aria-invalid="true"]')?.focus()
    return
  }
  const wait = cooldownRemaining('register', 30_000)
  if (wait) {
    serverError.value = `Please wait ${Math.ceil(wait / 1000)}s before trying again.`
    return
  }
  busy.value = true
  try {
    await registerAccount(form)
    markCooldown('register')
    router.push({ name: 'register-success', state: { email: form.email.trim() } })
  } catch {
    serverError.value = 'We could not reach the account service. Please try again in a few minutes.'
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <AuthLayout title="Create Your Account" subtitle="One account for the website and the game." wide>
    <form novalidate @submit.prevent="submit">
      <HoneypotField v-model="website" />

      <p v-if="serverError" class="alert alert--error" role="alert">{{ serverError }}</p>

      <TextField
        v-model="form.username" label="Username" autocomplete="username" name="username" :maxlength="RULES.usernameMax"
        :error="show('username')" :valid="!result.errors.username"
        :hint="`${RULES.usernameMin}–${RULES.usernameMax} letters or numbers. This is your in-game login.`"
        @blur="touched.username = true"
      />
      <div class="row">
        <TextField
          v-model="form.email" label="E-mail" type="email" autocomplete="email" name="email" :maxlength="RULES.emailMax"
          :error="show('email')" :valid="!result.errors.email" @blur="touched.email = true"
        />
        <TextField
          v-model="form.emailConfirm" label="Confirm e-mail" type="email" autocomplete="email" name="emailConfirm"
          :maxlength="RULES.emailMax" :error="show('emailConfirm')" :valid="!result.errors.emailConfirm"
          @blur="touched.emailConfirm = true"
        />
      </div>
      <div class="row">
        <TextField
          v-model="form.password" label="Password" type="password" autocomplete="new-password" name="password"
          :maxlength="RULES.passwordMax" :error="show('password')" :valid="!result.errors.password"
          @blur="touched.password = true"
        />
        <TextField
          v-model="form.passwordConfirm" label="Confirm password" type="password" autocomplete="new-password"
          name="passwordConfirm" :maxlength="RULES.passwordMax" :error="show('passwordConfirm')"
          :valid="!result.errors.passwordConfirm" @blur="touched.passwordConfirm = true"
        />
      </div>

      <div class="pw" aria-live="polite">
        <div class="pw__meter" :data-score="form.password ? strength : -1">
          <span v-for="n in 4" :key="n" :class="{ on: form.password && strength >= n }" />
        </div>
        <span class="pw__label">{{ form.password ? STRENGTH[strength] : 'Password strength' }}</span>
        <ul class="pw__rules">
          <li v-for="c in checks" :key="c.id" :class="{ ok: c.ok }">
            <AppIcon :name="c.ok ? 'check' : 'close'" :size="14" /> {{ c.label }}
          </li>
        </ul>
        <p class="pw__note">The WoW 3.3.5a client limits passwords to {{ RULES.passwordMax }} characters and treats them as case-insensitive.</p>
      </div>

      <label class="check">
        <input v-model="form.terms" type="checkbox" :aria-invalid="show('terms') ? 'true' : 'false'" @change="touched.terms = true" />
        <span>I have read and accept the <RouterLink :to="{ name: 'terms' }" target="_blank">Terms of Use</RouterLink> and the <RouterLink :to="{ name: 'privacy' }" target="_blank">Privacy Policy</RouterLink>.</span>
      </label>
      <p v-if="show('terms')" class="field-error" role="alert">{{ show('terms') }}</p>

      <label class="check">
        <input v-model="form.notifyDownloads" type="checkbox" />
        <span>E-mail me when the game downloads are available.</span>
      </label>

      <button type="submit" class="btn btn--gold btn--lg btn--block submit" :class="{ 'is-busy': busy }" :disabled="busy">
        <span v-if="busy" class="spinner" /> {{ busy ? 'Securing your account…' : 'Create Account' }}
      </button>
      <p class="secure"><AppIcon name="shield" :size="14" /> Your password never leaves this page — only an SRP6 verifier compatible with AzerothCore is sent.</p>
    </form>

    <template #footer>
      Already have an account? <RouterLink :to="{ name: 'login' }">Log in</RouterLink>
    </template>
  </AuthLayout>
</template>

<style scoped>
.row { display: grid; grid-template-columns: 1fr 1fr; gap: 0 16px; }
@media (max-width: 520px) { .row { grid-template-columns: 1fr; } }
.pw { margin: -4px 0 20px; padding: 14px 16px; border-radius: var(--radius-sm); background: rgba(3, 6, 10, .5); border: 1px solid var(--line); }
.pw__meter { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; margin-bottom: 8px; }
.pw__meter span { height: 4px; border-radius: 2px; background: #1a2838; transition: background .3s; }
.pw__meter[data-score='0'] span.on, .pw__meter[data-score='1'] span.on { background: var(--danger); }
.pw__meter[data-score='2'] span.on { background: var(--warn); }
.pw__meter[data-score='3'] span.on { background: var(--ice-300); }
.pw__meter[data-score='4'] span.on { background: var(--ok); }
.pw__label { font-size: .76rem; letter-spacing: .12em; text-transform: uppercase; color: var(--text-400); }
.pw__rules { list-style: none; padding: 0; margin: 10px 0 0; display: grid; grid-template-columns: 1fr 1fr; gap: 6px 12px; }
.pw__rules li { display: flex; gap: 6px; align-items: center; font-size: .8rem; color: var(--text-400); }
.pw__rules li.ok { color: var(--ok); }
.pw__note { margin: 10px 0 0; font-size: .76rem; color: var(--text-400); }
@media (max-width: 520px) { .pw__rules { grid-template-columns: 1fr; } }
.check { display: flex; gap: 12px; align-items: flex-start; margin: 0 0 14px; font-size: .9rem; color: var(--text-200); cursor: pointer; }
.check input { flex: none; width: 18px; height: 18px; margin-top: 2px; accent-color: var(--gold-400); cursor: pointer; }
.check input[aria-invalid='true'] { outline: 2px solid var(--danger); outline-offset: 2px; }
.submit { margin-top: 10px; }
.secure { display: flex; gap: 8px; align-items: flex-start; justify-content: center; margin: 14px 0 0; font-size: .76rem; color: var(--text-400); text-align: center; }
.secure svg { flex: none; margin-top: 2px; color: var(--ok); }
</style>
