<script setup>
import { ref, computed } from 'vue'
import { site } from '../../config/site.js'
import AppIcon from '../ui/AppIcon.vue'
import StageBadge from '../ui/StageBadge.vue'

const copied = ref(false)
const line = computed(() => `set realmlist ${site.realm.realmlist}`)

async function copy() {
  try {
    await navigator.clipboard.writeText(line.value)
    copied.value = true
    setTimeout(() => (copied.value = false), 2200)
  } catch { /* clipboard blocked — text stays selectable */ }
}
</script>

<template>
  <section id="play" class="section play" aria-labelledby="play-title">
    <div class="container">
      <div v-reveal class="play__box panel panel--frost">
        <div class="play__head">
          <p class="eyebrow">Play now</p>
          <h2 id="play-title" class="title-lg gold-text">The Realm Is Open.</h2>
          <p>
            A live {{ site.game.expansion }} {{ site.game.version }} realm you can join today —
            <template v-if="site.realm.latencyMs">{{ site.realm.region.toLowerCase() }}, with around {{ site.realm.latencyMs }} ms of measured latency.</template>
            <template v-else>{{ site.realm.region.toLowerCase() }}.</template>
          </p>
          <ul class="play__facts">
            <li><StageBadge :value="site.realm.status" /></li>
            <li><AppIcon name="globe" :size="16" /> {{ site.realm.region }} realm</li>
            <li v-if="site.realm.latencyMs"><AppIcon name="bolt" :size="16" /> ~{{ site.realm.latencyMs }} ms</li>
            <li><AppIcon name="shield" :size="16" /> Free · No Pay to Win</li>
          </ul>
        </div>

        <ol class="steps">
          <li class="step">
            <span class="step__n">1</span>
            <div>
              <h3>Create your account</h3>
              <p>Register and confirm your e-mail to activate it.</p>
              <RouterLink :to="{ name: 'register' }" class="btn btn--gold btn--sm">Create Account</RouterLink>
            </div>
          </li>
          <li class="step">
            <span class="step__n">2</span>
            <div>
              <h3>Get the client</h3>
              <p>The traditional 32-bit {{ site.game.version }} client is ready. Official downloads are listed below.</p>
              <a href="#downloads" class="btn btn--ghost btn--sm">Downloads</a>
            </div>
          </li>
          <li class="step">
            <span class="step__n">3</span>
            <div>
              <h3>Set the realmlist</h3>
              <p>Open <code>Data/&lt;locale&gt;/realmlist.wtf</code> and replace its content with:</p>
              <div v-if="site.realm.realmlist" class="rl">
                <code class="rl__code">{{ line }}</code>
                <button type="button" class="rl__copy" :aria-label="copied ? 'Copied' : 'Copy realmlist'" @click="copy">
                  <AppIcon :name="copied ? 'check' : 'fileCheck'" :size="18" /> {{ copied ? 'Copied' : 'Copy' }}
                </button>
              </div>
              <p v-else class="rl rl--soon">Realmlist address will be published here shortly.</p>
            </div>
          </li>
        </ol>
      </div>
    </div>
  </section>
</template>

<style scoped>
.play__box { padding: clamp(28px, 5vw, 56px); display: grid; grid-template-columns: 1fr 1.25fr; gap: clamp(28px, 5vw, 56px); background: radial-gradient(700px 360px at 0% 0%, rgba(79, 179, 247, .16), transparent 70%), linear-gradient(180deg, rgba(18, 33, 51, .88), rgba(6, 11, 18, .96)); box-shadow: 0 0 80px -30px var(--ice-glow), 0 30px 60px -25px rgba(0, 0, 0, .9); }
.play__head p:not(.eyebrow) { color: var(--text-300); }
.play__facts { list-style: none; padding: 0; margin: 22px 0 0; display: flex; flex-wrap: wrap; gap: 10px; }
.play__facts li { display: inline-flex; align-items: center; gap: 8px; font-size: .85rem; color: var(--text-100); padding: 6px 12px; border-radius: 999px; border: 1px solid var(--line); background: rgba(3, 6, 10, .5); }
.play__facts li:first-child { padding: 0; border: 0; background: none; }
.play__facts svg { color: var(--ice-300); }
.steps { list-style: none; margin: 0; padding: 0; display: grid; gap: 14px; counter-reset: s; }
.step { display: grid; grid-template-columns: 44px 1fr; gap: 16px; padding: 18px; border-radius: var(--radius); background: rgba(3, 6, 10, .55); border: 1px solid var(--line); }
.step h3 { font-size: 1.05rem; margin: 2px 0 4px; }
.step p { color: var(--text-300); font-size: .9rem; margin: 0 0 12px; }
.step code { color: var(--gold-200); font-size: .85em; }
.step__n { width: 44px; height: 44px; display: grid; place-items: center; border-radius: 50%; font: 700 1.1rem var(--font-display); color: var(--gold-100); border: 1px solid var(--gold-500); background: radial-gradient(circle, #1b3550, #070e16); }
.rl { display: flex; align-items: stretch; border-radius: 4px; overflow: hidden; border: 1px solid var(--ice-700); background: #02060b; }
.rl__code { flex: 1; padding: 12px 14px; font: 600 .95rem/1.3 ui-monospace, 'Cascadia Code', Consolas, monospace; color: var(--ice-100) !important; overflow-x: auto; white-space: nowrap; user-select: all; }
.rl__copy { display: inline-flex; align-items: center; gap: 6px; padding: 0 16px; border: 0; border-left: 1px solid var(--ice-700); background: rgba(79, 179, 247, .15); color: var(--ice-100); font-weight: 600; font-size: .82rem; cursor: pointer; }
.rl__copy:hover { background: rgba(79, 179, 247, .28); }
.rl--soon { padding: 12px 14px; color: var(--text-400) !important; font-style: italic; margin: 0 !important; }
@media (max-width: 900px) { .play__box { grid-template-columns: 1fr; } }
</style>
