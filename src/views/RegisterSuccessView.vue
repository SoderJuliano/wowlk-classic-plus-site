<script setup>
import AuthLayout from '../components/auth/AuthLayout.vue'
import AppIcon from '../components/ui/AppIcon.vue'
</script>

<template>
  <AuthLayout title="Your Journey Begins" subtitle="Registration received.">
    <div class="ok">
      <div class="ok__icon"><AppIcon name="check" :size="34" /></div>
      <p>We're creating your account. It will be ready in about 2 minutes, with no further steps.</p>
      <ol class="ok__steps">
        <li>Wait about 2 minutes.</li>
        <li>Sign in with the launcher (or the game) using your username and password.</li>
        <li>Start your adventure!</li>
      </ol>
      <p class="ok__small">We also send a confirmation e-mail. If you can't sign in after a few minutes, the username or e-mail may already be in use: check your inbox and spam folder, or register again with a different username.</p>
      <RouterLink :to="{ name: 'login' }" class="btn btn--ghost btn--block">Log In</RouterLink>
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
