<script setup>
import AppIcon from '../ui/AppIcon.vue'
import StageBadge from '../ui/StageBadge.vue'
import { STAGE } from '../../config/site.js'
import scorpid from '../../assets/shots/elite-scorpid.webp'
import sunbough from '../../assets/shots/elite-sunbough.webp'
import bristleback from '../../assets/shots/elite-bristleback.webp'

// Real in-game captures. More elites exist on the realm than are pictured here.
const elites = [
  { img: scorpid, name: 'Alpha Scorpid Worker', level: 4, zone: 'Durotar' },
  { img: sunbough, name: 'Sunbough Ancient', level: 4, zone: 'Eversong Woods' },
  { img: bristleback, name: 'Bristleback Warchief', level: 5, zone: 'Mulgore' }
]
const facts = [
  { icon: 'swords', text: 'Near every starting area, from the first levels' },
  { icon: 'users', text: 'Solo if you dare — or bring friends' },
  { icon: 'chest', text: 'Guaranteed loot: a 4-slot bag, a starter gem and silver' },
  { icon: 'shield', text: 'Completely optional — the normal path is unchanged' }
]
</script>

<template>
  <section id="elites" class="section elites" aria-labelledby="elites-title">
    <div class="container">
      <div class="elites__head">
        <div v-reveal>
          <p class="eyebrow">Optional challenge</p>
          <h2 id="elites-title" class="title-xl gold-text">Elite Mini-Bosses</h2>
          <p class="elites__lead">
            Tougher elite foes now lurk near the starting zones. Harder than anything around them,
            and worth the fight — especially when you are just starting out.
          </p>
        </div>
        <ul v-reveal="100" class="elites__facts">
          <li v-for="f in facts" :key="f.text"><AppIcon :name="f.icon" :size="18" /> {{ f.text }}</li>
        </ul>
      </div>

      <div class="elites__grid">
        <figure v-for="(e, i) in elites" :key="e.name" v-reveal="i * 90" class="elite">
          <img :src="e.img" :alt="`${e.name}, a level ${e.level} elite in ${e.zone}`" width="1009" height="795" loading="lazy" decoding="async" />
          <figcaption>
            <span class="elite__name">{{ e.name }}</span>
            <span class="elite__meta">Level {{ e.level }} elite · {{ e.zone }}</span>
          </figcaption>
        </figure>
      </div>

      <p v-reveal class="elites__more">
        <StageBadge :value="STAGE.LIVE" label="Live" />
        More elites are already on the realm — and new ones keep arriving.
      </p>
    </div>
  </section>
</template>

<style scoped>
.elites__head { display: grid; grid-template-columns: 1.1fr 1fr; gap: clamp(24px, 5vw, 64px); align-items: end; margin-bottom: clamp(28px, 4vw, 44px); }
.elites__lead { color: var(--text-300); font-size: 1.05rem; max-width: 560px; }
.elites__facts { list-style: none; margin: 0; padding: 0; display: grid; gap: 12px; }
.elites__facts li { display: flex; gap: 10px; align-items: center; color: var(--text-100); font-size: .95rem; }
.elites__facts svg { flex: none; color: var(--gold-300); }
.elites__grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
.elite { position: relative; margin: 0; overflow: hidden; border-radius: var(--radius-lg); border: 1px solid rgba(212, 168, 69, .3); aspect-ratio: 4 / 3.4; }
.elite img { width: 100%; height: 100%; max-width: none; object-fit: cover; transition: transform .7s var(--ease); }
.elite:hover img { transform: scale(1.05); }
.elite figcaption {
  position: absolute; inset: auto 0 0; display: grid; gap: 4px; padding: 40px 20px 18px;
  background: linear-gradient(180deg, transparent, rgba(3, 6, 10, .92));
}
.elite__name { font: 700 1.15rem/1.2 var(--font-display); color: var(--gold-100); }
.elite__meta { font-size: .82rem; color: var(--text-300); }
.elites__more { display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 12px; margin: 26px 0 0; color: var(--text-300); font-size: .92rem; }
@media (max-width: 900px) {
  .elites__head { grid-template-columns: 1fr; }
  .elites__grid { grid-template-columns: 1fr; }
  .elite { aspect-ratio: 4 / 3; }
}
</style>
