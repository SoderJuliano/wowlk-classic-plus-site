<script setup>
import { site, STAGE } from '../../config/site.js'
import SectionHead from '../ui/SectionHead.vue'
import AppIcon from '../ui/AppIcon.vue'
import StageBadge from '../ui/StageBadge.vue'

const never = ['Competitive advantages', 'Better gear or stats', 'Gold, boosts or XP multipliers', 'Anything required to play']
const pass = [
  { icon: 'gift', text: 'Free Battle Pass track for everyone' },
  { icon: 'palette', text: 'Cosmetic-only content' },
  { icon: 'crown', text: 'Participation rewards' },
  { icon: 'heart', text: 'Possible special passes for supporters' },
  { icon: 'calendar', text: 'Events and seasons' }
]
</script>

<template>
  <section id="support" class="section sup" aria-labelledby="sup-title">
    <div class="container">
      <SectionHead id="sup-title" eyebrow="Free to play · No Pay to Win" title="Support the Project. Shape the Future.">
        <p>
          WoW Classic Plus LK is free to play. Your support helps us maintain the infrastructure, improve the clients
          and continue developing new features.
        </p>
      </SectionHead>

      <div class="sup__grid">
        <article v-reveal class="sup__card panel">
          <AppIcon name="heart" :size="30" class="sup__icon" />
          <h3>Voluntary contributions</h3>
          <p>Supporting is entirely optional — a contribution, never a purchase required to play.</p>
          <p class="sup__perk"><AppIcon name="chip" :size="18" /> Supporters may receive early access to the 64-bit client during testing periods, subject to availability and project rules.</p>
          <a v-if="site.links.support" :href="site.links.support" class="btn btn--gold" target="_blank" rel="noopener noreferrer">Support the project</a>
          <span v-else class="has-tooltip">
            <button type="button" class="btn btn--gold" disabled aria-describedby="sup-tip">Support the project</button>
            <span id="sup-tip" role="tooltip" class="tooltip">Coming Soon</span>
          </span>
        </article>

        <article v-reveal="100" class="sup__card panel sup__never">
          <AppIcon name="shield" :size="30" class="sup__icon" />
          <h3>Support will never grant</h3>
          <ul>
            <li v-for="n in never" :key="n"><AppIcon name="close" :size="16" /> {{ n }}</li>
          </ul>
        </article>

        <article v-reveal="200" class="sup__card panel panel--frost">
          <div class="sup__row">
            <AppIcon name="crown" :size="30" class="sup__icon" />
            <StageBadge :value="STAGE.PLANNED" />
          </div>
          <h3>Battle Pass</h3>
          <p>A concept we are planning — no payments or checkout exist yet.</p>
          <ul class="sup__pass">
            <li v-for="p in pass" :key="p.text"><AppIcon :name="p.icon" :size="16" /> {{ p.text }}</li>
          </ul>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.sup__grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px; }
.sup__card { display: grid; align-content: start; gap: 12px; }
.sup__card h3 { font-size: 1.25rem; margin: 0; }
.sup__card p { color: var(--text-300); margin: 0; font-size: .95rem; }
.sup__card .btn, .sup__card .has-tooltip { margin-top: 10px; justify-self: start; }
.sup__icon { color: var(--gold-300); }
.sup__row { display: flex; justify-content: space-between; align-items: center; }
.sup__perk { display: flex; gap: 10px; padding: 12px 14px; border-radius: 4px; background: rgba(79, 179, 247, .08); border: 1px solid var(--line); color: var(--ice-100) !important; }
.sup__perk svg { flex: none; color: var(--ice-300); margin-top: 3px; }
.sup__card ul { list-style: none; padding: 0; margin: 0; display: grid; gap: 10px; }
.sup__card li { display: flex; align-items: center; gap: 10px; font-size: .93rem; color: var(--text-200); }
.sup__never li svg { color: var(--danger); }
.sup__pass li svg { color: var(--ice-300); }
@media (max-width: 960px) { .sup__grid { grid-template-columns: 1fr; } }
@media (max-width: 480px) {
  .sup__card { padding: 20px 16px; }
  .sup__card .btn, .sup__card .has-tooltip { width: 100%; }
  .sup__card .btn { width: 100%; justify-content: center; }
}
</style>
