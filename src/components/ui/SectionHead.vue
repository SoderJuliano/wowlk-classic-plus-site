<script setup>
defineProps({
  eyebrow: { type: String, default: '' },
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  id: { type: String, default: undefined },
  frost: { type: Boolean, default: false }
})
</script>

<template>
  <header v-reveal class="section-head">
    <p v-if="eyebrow" class="eyebrow">{{ eyebrow }}</p>
    <h2 :id="id" class="title-xl" :class="frost ? 'frost-text' : 'gold-text'">{{ title }}</h2>
    <p v-if="subtitle" class="section-head__sub">{{ subtitle }}</p>
    <div class="divider" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 15 9l7 3-7 3-3 7-3-7-7-3 7-3z" /></svg>
    </div>
    <div v-if="$slots.default" class="section-head__body"><slot /></div>
  </header>
</template>

<style scoped>
.section-head__sub { font: 600 clamp(1.05rem, 2vw, 1.3rem)/1.4 var(--font-display); color: var(--ice-200) !important; letter-spacing: .04em; margin-top: 4px; }
.section-head__body { margin-top: 22px; }
</style>
