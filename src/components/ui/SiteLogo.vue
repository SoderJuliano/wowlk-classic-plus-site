<script setup>
import { useId } from 'vue'
import { site } from '../../config/site.js'

defineProps({
  compact: { type: Boolean, default: false },
  size: { type: Number, default: 44 }
})
const uid = useId()
const id = (n) => `${uid}-${n}`
</script>

<template>
  <span class="logo" :class="{ 'logo--compact': compact }">
    <svg class="logo__mark" :width="size" :height="size" viewBox="0 0 64 64" aria-hidden="true">
      <defs>
        <linearGradient :id="id('gold')" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#fff1c9" />
          <stop offset=".45" stop-color="#e9c46a" />
          <stop offset="1" stop-color="#8a6420" />
        </linearGradient>
        <linearGradient :id="id('ice')" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#ffffff" />
          <stop offset=".5" stop-color="#9fdcff" />
          <stop offset="1" stop-color="#1f78c2" />
        </linearGradient>
        <radialGradient :id="id('core')" cx=".5" cy=".42" r=".6">
          <stop offset="0" stop-color="#16314d" />
          <stop offset="1" stop-color="#050a10" />
        </radialGradient>
        <filter :id="id('glow')" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.6" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <!-- shield -->
      <path d="M32 2 58 15v26L32 62 6 41V15z" :fill="`url(#${id('core')})`" :stroke="`url(#${id('gold')})`" stroke-width="2.4" />
      <path d="M32 7.5 53 18v21.4L32 56.3 11 39.4V18z" fill="none" stroke="#e9c46a" stroke-opacity=".35" stroke-width=".8" />
      <!-- frost crown -->
      <g :filter="`url(#${id('glow')})`">
        <path d="M15 40 19 22.5l6 9.5 7-18 7 18 6-9.5L49 40z" :fill="`url(#${id('ice')})`" />
        <path d="M15 40h34l-2.2 4.4H17.2z" :fill="`url(#${id('gold')})`" />
        <!-- the "plus" gem -->
        <path d="M32 44.5v9M27.5 49h9" stroke="#bfe8ff" stroke-width="2.6" stroke-linecap="round" />
      </g>
    </svg>
    <span v-if="!compact" class="logo__text">
      <span class="logo__top">WoW Classic</span>
      <span class="logo__bottom">Plus <i>·</i> LK</span>
    </span>
    <span v-if="compact" class="sr-only">{{ site.name }}</span>
  </span>
</template>

<style scoped>
.logo { display: inline-flex; align-items: center; gap: 12px; color: inherit; }
.logo__mark { filter: drop-shadow(0 0 10px rgba(95, 190, 255, .35)); transition: filter .3s var(--ease); }
.logo:hover .logo__mark { filter: drop-shadow(0 0 16px rgba(95, 190, 255, .6)); }
.logo__text { display: grid; line-height: 1; }
.logo__top {
  font: 700 1.08rem/1 var(--font-display); letter-spacing: .08em; text-transform: uppercase;
  background: linear-gradient(180deg, #fff6dc, var(--gold-300) 55%, var(--gold-500));
  -webkit-background-clip: text; background-clip: text; color: transparent;
}
.logo__bottom {
  margin-top: 5px; font: 600 .7rem/1 var(--font-display); letter-spacing: .42em; text-transform: uppercase; color: var(--ice-200);
}
.logo__bottom i { color: var(--gold-400); font-style: normal; }
</style>
