<script setup>
import AppIcon from '../ui/AppIcon.vue'
import featuresImg from '../../assets/bg/features.webp'
import client64Img from '../../assets/bg/client64.webp'
import downloadImg from '../../assets/bg/download.webp'

const cards = [
  { to: { name: 'features' }, img: featuresImg, pos: '70% 40%', eyebrow: 'Live on the realm', title: 'What’s Different', text: 'Reworked abilities, new race & class combos and elite mini-bosses.' },
  { to: { name: 'client64' }, img: client64Img, pos: '60% 40%', eyebrow: 'In development', title: 'Native 64-bit Client', text: 'Windows and Linux, with improved physics, ray tracing and upscaling.' },
  { to: { name: 'download' }, img: downloadImg, pos: '50% 35%', eyebrow: 'Ready in minutes', title: 'Download & Play', text: 'One launcher installs the game and keeps it up to date.' }
]
</script>

<template>
  <section class="explore" aria-label="Explore">
    <div class="container explore__grid">
      <RouterLink
        v-for="(c, i) in cards" :key="c.title" v-reveal="i * 90" :to="c.to" class="card"
      >
        <img :src="c.img" alt="" class="card__img" :style="{ objectPosition: c.pos }" loading="lazy" decoding="async" />
        <span class="card__body">
          <span class="card__eyebrow">{{ c.eyebrow }}</span>
          <span class="card__title">{{ c.title }}</span>
          <span class="card__text">{{ c.text }}</span>
          <span class="card__more">Explore <AppIcon name="arrowRight" :size="16" /></span>
        </span>
      </RouterLink>
    </div>
  </section>
</template>

<style scoped>
.explore { padding: 24px 0 clamp(56px, 8vw, 112px); }
.explore__grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
.card {
  position: relative; isolation: isolate; overflow: hidden; display: flex; align-items: flex-end;
  min-height: 340px; border-radius: var(--radius-lg); border: 1px solid var(--line);
  color: var(--text-100);
  transition: border-color .35s var(--ease), transform .35s var(--ease), box-shadow .35s var(--ease);
}
.card::after {
  content: ''; position: absolute; inset: 0; z-index: -1;
  background: linear-gradient(180deg, rgba(3, 6, 10, .1) 0%, rgba(3, 6, 10, .55) 50%, rgba(3, 6, 10, .95) 100%);
}
.card__img {
  position: absolute; inset: 0; z-index: -2; width: 100%; height: 100%; max-width: none;
  object-fit: cover; transition: transform .8s var(--ease), filter .5s var(--ease); filter: saturate(.85) brightness(.85);
}
.card:hover { color: var(--text-100); border-color: rgba(233, 196, 106, .45); transform: translateY(-4px); box-shadow: 0 24px 50px -24px rgba(0, 0, 0, .9), 0 0 40px -18px var(--ice-glow); }
.card:hover .card__img { transform: scale(1.06); filter: saturate(1) brightness(1); }
.card__body { display: grid; gap: 8px; padding: 28px; }
.card__eyebrow { font: 600 .68rem/1 var(--font-body); letter-spacing: .22em; text-transform: uppercase; color: var(--ice-300); }
.card__title { font: 700 1.4rem/1.15 var(--font-display); }
.card__text { font-size: .92rem; color: var(--text-300); }
.card__more {
  display: inline-flex; align-items: center; gap: 6px; margin-top: 6px;
  font: 700 .74rem/1 var(--font-display); letter-spacing: .16em; text-transform: uppercase; color: var(--gold-300);
}
.card__more svg { transition: transform .3s var(--ease); }
.card:hover .card__more svg { transform: translateX(4px); }
@media (max-width: 900px) {
  .explore__grid { grid-template-columns: 1fr; }
  .card { min-height: 240px; }
}
</style>
