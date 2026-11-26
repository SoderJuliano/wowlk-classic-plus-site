<script setup>
defineProps({
  image: { type: String, required: true },
  /** CSS object-position, to keep the subject of each wallpaper in frame. */
  position: { type: String, default: '50% 40%' },
  eyebrow: { type: String, default: '' },
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  /** Extra room at the bottom when the next block overlaps the banner (e.g. realm status bar). */
  overlap: { type: Boolean, default: false }
})
</script>

<template>
  <header class="banner" :class="{ 'banner--overlap': overlap }">
    <img :src="image" alt="" class="banner__img" :style="{ objectPosition: position }" fetchpriority="high" decoding="async" />
    <div class="banner__shade" aria-hidden="true" />
    <div class="container banner__content">
      <p v-if="eyebrow" class="banner__eyebrow">{{ eyebrow }}</p>
      <h1 class="banner__title">{{ title }}</h1>
      <p v-if="subtitle" class="banner__sub">{{ subtitle }}</p>
    </div>
  </header>
</template>

<style scoped>
.banner {
  position: relative; isolation: isolate; overflow: hidden;
  min-height: clamp(340px, 54vh, 540px); display: flex; align-items: flex-end;
  padding: calc(var(--header-h) + 40px) 0 clamp(40px, 6vw, 72px);
}
.banner--overlap { padding-bottom: clamp(110px, 12vw, 150px); }
.banner__img { position: absolute; inset: 0; z-index: -2; width: 100%; height: 100%; max-width: none; object-fit: cover; }
.banner__shade {
  position: absolute; inset: 0; z-index: -1; pointer-events: none;
  background:
    linear-gradient(90deg, rgba(3, 6, 10, .85) 0%, rgba(3, 6, 10, .45) 45%, transparent 75%),
    linear-gradient(180deg, rgba(3, 6, 10, .6) 0%, transparent 30%, transparent 55%, var(--bg-900) 100%);
}
.banner__content { display: grid; justify-items: start; }
.banner__eyebrow { font: 600 .72rem/1 var(--font-body); letter-spacing: .28em; text-transform: uppercase; color: var(--ice-300); margin-bottom: 14px; }
.banner__title {
  margin: 0; max-width: 16ch; font: 700 clamp(2rem, 5vw, 3.6rem)/1.05 var(--font-display);
  color: var(--gold-200); text-shadow: 0 2px 4px rgba(0, 0, 0, .75), 0 0 24px rgba(0, 0, 0, .55);}
.banner__sub { margin: 14px 0 0; max-width: 560px; font-size: clamp(1rem, 1.6vw, 1.15rem); color: var(--text-200); text-shadow: 0 1px 10px rgba(0, 0, 0, .9); }
</style>
