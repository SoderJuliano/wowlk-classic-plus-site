<script setup>
import { site } from '../../config/site.js'
import AppIcon from '../ui/AppIcon.vue'
import StageBadge from '../ui/StageBadge.vue'
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
              <p>Register here. Your account is ready in about 2 minutes.</p>
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
@media (max-width: 900px) { .play__box { grid-template-columns: 1fr; } }
@media (max-width: 560px) {
  .play__box { padding: 20px 14px; gap: 24px; }
  .play__facts { gap: 8px; margin-top: 16px; }
  .play__facts li { font-size: .78rem; padding: 5px 10px; }
  .step { grid-template-columns: 34px 1fr; gap: 10px; padding: 14px 12px; }
  .step__n { width: 34px; height: 34px; font-size: .9rem; }
  .step h3 { font-size: .98rem; }
  .step p { font-size: .85rem; }
  .step .btn { width: 100%; }
}
</style>
