<script setup>
import { site } from '../../config/site.js'
import VideoEmbed from '../ui/VideoEmbed.vue'
import AppIcon from '../ui/AppIcon.vue'
</script>

<template>
  <section class="section cmpv" aria-labelledby="cmpv-title">
    <div class="container cmpv__grid">
      <div v-reveal class="cmpv__copy">
        <p class="cmpv__eyebrow">Same scene · Same character</p>
        <h2 id="cmpv-title" class="title-lg">The Wrath you know.<br /><span class="frost-text">Seen like never before.</span></h2>
        <p>
          Left: the classic 32-bit client. Right: our native 64-bit client, still in development.
          Same place, same hero — just a new generation of Azeroth.
        </p>
        <RouterLink :to="{ name: 'client64' }" class="cmpv__more">
          About the 64-bit client <AppIcon name="arrowRight" :size="16" />
        </RouterLink>
      </div>
      <div v-reveal="120" class="cmpv__video">
        <VideoEmbed :id="site.videos.compare32vs64.id" :title="site.videos.compare32vs64.title" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.cmpv { padding-top: clamp(40px, 6vw, 80px); }
.cmpv__grid { display: grid; grid-template-columns: .8fr 1.4fr; gap: clamp(28px, 5vw, 64px); align-items: center; }
.cmpv__eyebrow { font: 600 .72rem/1 var(--font-body); letter-spacing: .26em; text-transform: uppercase; color: var(--ice-300); margin-bottom: 14px; }
.cmpv__copy p:not(.cmpv__eyebrow) { color: var(--text-300); }
.cmpv__more {
  display: inline-flex; align-items: center; gap: 6px; margin-top: 4px;
  font: 700 .76rem/1 var(--font-display); letter-spacing: .16em; text-transform: uppercase; color: var(--gold-300);
}
.cmpv__more:hover { color: var(--gold-100); }
@media (max-width: 900px) {
  .cmpv__grid { grid-template-columns: 1fr; }
  .cmpv__copy { text-align: center; }
}
</style>
