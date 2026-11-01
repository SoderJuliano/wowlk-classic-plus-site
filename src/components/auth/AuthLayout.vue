<script setup>
import NorthrendScene from '../ui/NorthrendScene.vue'
import SiteLogo from '../ui/SiteLogo.vue'

defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  wide: { type: Boolean, default: false }
})
</script>

<template>
  <section class="auth">
    <div class="auth__bg" aria-hidden="true"><NorthrendScene :animated="false" /></div>
    <div class="auth__box panel" :class="{ 'auth__box--wide': wide }">
      <div class="auth__emblem"><SiteLogo compact :size="64" /></div>
      <h1 class="auth__title gold-text">{{ title }}</h1>
      <p v-if="subtitle" class="auth__sub">{{ subtitle }}</p>
      <slot />
      <div v-if="$slots.footer" class="auth__footer"><slot name="footer" /></div>
    </div>
  </section>
</template>

<style scoped>
.auth { position: relative; min-height: 100svh; display: grid; place-items: center; padding: calc(var(--header-h) + 48px) 16px 64px; overflow: hidden; }
.auth__bg { position: absolute; inset: 0; z-index: -1; opacity: .55; filter: blur(2px) saturate(.9); }
.auth__bg::after { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse at center, rgba(6, 11, 18, .4), rgba(6, 11, 18, .95) 75%); }
.auth__box { width: 100%; max-width: 460px; padding: 56px clamp(22px, 5vw, 40px) 32px; box-shadow: 0 0 0 1px rgba(0, 0, 0, .6), 0 40px 90px -30px rgba(0, 0, 0, .95), 0 0 80px -40px var(--ice-glow); animation: rise .5s var(--ease); }
.auth__box--wide { max-width: 560px; }
@keyframes rise { from { opacity: 0; transform: translateY(16px); } }
.auth__emblem { position: absolute; top: -40px; left: 50%; transform: translateX(-50%); padding: 8px; border-radius: 50%; background: var(--bg-900); border: 1px solid rgba(212, 168, 69, .4); }
.auth__title { text-align: center; font-size: clamp(1.6rem, 4vw, 2.1rem); margin-top: 8px; }
.auth__sub { text-align: center; color: var(--text-300); margin-bottom: 28px; }
.auth__footer { margin-top: 24px; padding-top: 20px; border-top: 1px solid var(--line); text-align: center; font-size: .9rem; color: var(--text-300); }
</style>
