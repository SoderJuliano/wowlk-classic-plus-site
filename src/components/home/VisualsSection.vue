<script setup>
import { ref } from 'vue'
import NorthrendScene from '../ui/NorthrendScene.vue'
import AppIcon from '../ui/AppIcon.vue'

const split = ref(50)
const items = [
  { icon: 'user', title: 'Updated HD models' },
  { icon: 'sparkles', title: 'Enhanced visual effects' },
  { icon: 'palette', title: 'Improved colors' },
  { icon: 'layers', title: 'Greater visual depth' },
  { icon: 'monitor', title: 'Modernized interface' },
  { icon: 'eye', title: 'A more pleasant look overall' }
]
</script>

<template>
  <section id="visuals" class="section vis" aria-labelledby="vis-title">
    <div class="container vis__grid">
      <div v-reveal class="vis__copy">
        <p class="eyebrow">Modernized visuals</p>
        <h2 id="vis-title" class="title-xl gold-text">Experience Azeroth in a New Light.</h2>
        <p>
          Both the traditional client and the new 64-bit client receive visual improvements. The 64-bit client goes
          further, with additional room for graphical evolution over time.
        </p>
        <ul class="vis__list">
          <li v-for="it in items" :key="it.title"><AppIcon :name="it.icon" :size="20" /> {{ it.title }}</li>
        </ul>
        <p class="note">
          <AppIcon name="info" />
          <span>Third-party mods and addons may be incompatible, especially in the first releases of the 64-bit client. Universal compatibility is not guaranteed.</span>
        </p>
      </div>

      <figure v-reveal="120" class="cmp panel">
        <div class="cmp__stage" :style="{ '--split': split + '%' }">
          <div class="cmp__layer cmp__layer--classic"><NorthrendScene :animated="false" /></div>
          <div class="cmp__layer cmp__layer--plus"><NorthrendScene :animated="false" /></div>
          <span class="cmp__tag cmp__tag--l">Classic</span>
          <span class="cmp__tag cmp__tag--r">Plus</span>
          <span class="cmp__handle" aria-hidden="true"><AppIcon name="switch" :size="18" /></span>
          <label class="sr-only" for="cmp-range">Compare classic and enhanced look</label>
          <input id="cmp-range" v-model.number="split" class="cmp__range" type="range" min="0" max="100" step="1" />
        </div>
        <figcaption>Illustrative concept of the color and lighting direction — not in-game footage.</figcaption>
      </figure>
    </div>
  </section>
</template>

<style scoped>
.vis__grid { display: grid; grid-template-columns: 1fr 1.1fr; gap: clamp(32px, 6vw, 72px); align-items: center; }
.vis__copy > p { color: var(--text-300); }
.vis__list { list-style: none; padding: 0; margin: 24px 0; display: grid; grid-template-columns: 1fr 1fr; gap: 12px 20px; }
.vis__list li { display: flex; align-items: center; gap: 10px; color: var(--text-100); font-size: .95rem; }
.vis__list svg { color: var(--gold-300); flex: none; }

.cmp { margin: 0; padding: 10px; }
.cmp figcaption { font-size: .78rem; color: var(--text-400); text-align: center; padding: 12px 6px 4px; }
.cmp__stage { position: relative; aspect-ratio: 16 / 10; overflow: hidden; border-radius: 6px; }
.cmp__layer { position: absolute; inset: 0; }
.cmp__layer--classic { filter: saturate(.45) contrast(.85) brightness(.82) sepia(.18); }
.cmp__layer--plus { filter: saturate(1.35) contrast(1.12) brightness(1.08); clip-path: inset(0 0 0 var(--split)); }
.cmp__stage::after { content: ''; position: absolute; top: 0; bottom: 0; left: var(--split); width: 2px; margin-left: -1px; background: linear-gradient(180deg, transparent, var(--gold-200), transparent); box-shadow: 0 0 16px var(--gold-glow); pointer-events: none; }
.cmp__handle { position: absolute; top: 50%; left: var(--split); transform: translate(-50%, -50%); width: 42px; height: 42px; display: grid; place-items: center; border-radius: 50%; background: #0b131d; border: 1px solid var(--gold-300); color: var(--gold-200); box-shadow: 0 0 20px rgba(0, 0, 0, .7); pointer-events: none; z-index: 2; }
.cmp__tag { position: absolute; top: 14px; padding: 6px 10px; border-radius: 3px; font: 700 .66rem/1 var(--font-body); letter-spacing: .2em; text-transform: uppercase; background: rgba(3, 6, 10, .75); z-index: 2; }
.cmp__tag--l { left: 14px; color: var(--text-300); }
.cmp__tag--r { right: 14px; color: var(--ice-200); }
.cmp__range { position: absolute; inset: 0; width: 100%; height: 100%; margin: 0; opacity: 0; cursor: ew-resize; z-index: 3; }
.cmp__range:focus-visible + .cmp__handle, .cmp__stage:focus-within .cmp__handle { outline: 2px solid var(--ice-300); outline-offset: 3px; }
@media (max-width: 960px) { .vis__grid { grid-template-columns: 1fr; } }
@media (max-width: 480px) { .vis__list { grid-template-columns: 1fr; } }
</style>
