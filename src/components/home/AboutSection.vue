<script setup>
import { STAGE } from '../../config/site.js'
import StageBadge from '../ui/StageBadge.vue'

// Honest project ledger — edit as things move.
const ledger = [
  {
    stage: STAGE.LIVE,
    title: 'Available on the realm',
    items: ['Live global realm', 'Traditional 32-bit client', 'Redesigned starting abilities', 'Improved vendors & items', 'Enhanced early drops', 'Redesigned professions + armor recycling', 'Companion pets as mounts (Hunter)', 'Original XP progression', 'Tested PvP & dungeons']
  },
  {
    stage: STAGE.IN_DEVELOPMENT,
    title: 'In development',
    items: ['Native 64-bit client (Windows)', 'Native Linux build (early build running)', 'Ray tracing & FSR (experimental)', 'HD models & visual upgrades', 'Official launcher']
  },
  {
    stage: STAGE.PLANNED,
    title: 'Planned',
    items: ['macOS client', 'Full FSR & DLSS 5 support', 'Battle Pass (free + cosmetic)', 'Seasonal events']
  }
]
</script>

<template>
  <section id="about" class="section about" aria-labelledby="about-title">
    <div class="container about__grid">
      <div v-reveal class="about__copy">
        <p class="eyebrow">The Project</p>
        <h2 id="about-title" class="title-xl gold-text">Classic at Heart.<br />Plus by Design.</h2>
        <p class="about__lead">
          WoW Classic Plus LK was born from the desire to preserve the classic Wrath of the Lich King experience
          while evolving what can be improved.
        </p>
        <p>
          We are not building a completely different game. We are refining the original experience — respecting
          its identity, its progression and its essence.
        </p>
        <blockquote class="about__quote">
          <span aria-hidden="true">“</span>Blizzard-like at the core. Improved where it matters. Free for everyone.
        </blockquote>
      </div>

      <div class="about__ledger">
        <article v-for="(col, i) in ledger" :key="col.stage" v-reveal="i * 90" class="ledger panel">
          <header class="ledger__head">
            <h3>{{ col.title }}</h3>
            <StageBadge :value="col.stage" />
          </header>
          <ul>
            <li v-for="it in col.items" :key="it" :class="`is-${col.stage}`">{{ it }}</li>
          </ul>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.about__grid { display: grid; grid-template-columns: 1fr 1.05fr; gap: clamp(32px, 6vw, 80px); align-items: center; }
.about__lead { font-size: 1.15rem; color: var(--text-100); }
.about__copy p { color: var(--text-300); }
.about__quote { margin: 28px 0 0; padding: 18px 22px; border-left: 2px solid var(--gold-400); background: linear-gradient(90deg, rgba(233, 196, 106, .08), transparent); font: 600 1.05rem/1.5 var(--font-display); color: var(--gold-100); }
.about__quote span { color: var(--gold-400); margin-right: 4px; }
.about__ledger { display: grid; gap: 16px; }
.ledger { padding: 22px 24px; }
.ledger__head { display: flex; justify-content: space-between; align-items: center; gap: 12px; margin-bottom: 14px; }
.ledger__head h3 { font-size: 1.05rem; margin: 0; }
.ledger ul { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: 1fr 1fr; gap: 8px 18px; }
.ledger li { position: relative; padding-left: 18px; font-size: .9rem; color: var(--text-200); }
.ledger li::before { content: ''; position: absolute; left: 0; top: .62em; width: 7px; height: 7px; transform: rotate(45deg); border: 1px solid currentColor; }
.ledger li.is-live::before { color: var(--ok); background: rgba(95, 224, 160, .3); }
.ledger li.is-in-development::before { color: var(--ice-300); }
.ledger li.is-planned::before { color: var(--gold-300); }
@media (max-width: 960px) { .about__grid { grid-template-columns: 1fr; } }
@media (max-width: 480px) {
  .about__quote { font-size: .95rem; padding: 12px 16px; margin-top: 18px; }
  .ledger { padding: 16px; }
  .ledger__head { flex-wrap: wrap; gap: 8px; }
  .ledger__head h3 { font-size: .95rem; }
  .ledger ul { grid-template-columns: 1fr; }
}
</style>
