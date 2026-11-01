<script setup>
import { computed } from 'vue'
import { site, RELEASE } from '../../config/site.js'
import AppIcon from '../ui/AppIcon.vue'
import StageBadge from '../ui/StageBadge.vue'
import SiteLogo from '../ui/SiteLogo.vue'

const ready = computed(() => site.launcher.status === RELEASE.AVAILABLE && !!(site.launcher.windowsUrl || site.launcher.linuxUrl))
const perks = [
  { icon: 'download', text: 'Simplified installation' },
  { icon: 'refresh', text: 'Automatic updates' },
  { icon: 'fileCheck', text: 'File verification' },
  { icon: 'folder', text: 'Version management' },
  { icon: 'switch', text: 'Choose 32-bit or 64-bit client' },
  { icon: 'cloud', text: 'Centralized update downloads' }
]
</script>

<template>
  <section id="launcher" class="section lnc" aria-labelledby="lnc-title">
    <div class="container lnc__grid">
      <div v-reveal class="lnc__copy">
        <p class="eyebrow">Official launcher</p>
        <h2 id="lnc-title" class="title-xl gold-text">One Launcher. Your Entire Azeroth Experience.</h2>
        <p>We are preparing our own launcher to make installing, updating and managing the game effortless. It is planned to ship alongside the official launch.</p>
        <ul class="lnc__perks">
          <li v-for="p in perks" :key="p.text"><AppIcon :name="p.icon" :size="18" /> {{ p.text }}</li>
        </ul>

        <div v-if="ready" class="lnc__dl">
          <a v-if="site.launcher.windowsUrl" :href="site.launcher.windowsUrl" class="btn btn--frost btn--lg" target="_blank" rel="noopener noreferrer"><AppIcon name="windows" /> Windows</a>
          <a v-if="site.launcher.linuxUrl" :href="site.launcher.linuxUrl" class="btn btn--gold btn--lg" target="_blank" rel="noopener noreferrer"><AppIcon name="linux" /> Linux</a>
        </div>
        <span v-else class="has-tooltip">
          <button type="button" class="btn btn--frost btn--lg" disabled aria-describedby="lnc-tip">
            <AppIcon name="lock" /> Download Launcher
          </button>
          <span id="lnc-tip" role="tooltip" class="tooltip">Coming Soon</span>
        </span>
      </div>

      <!-- Launcher mock-up (pure CSS) -->
      <div v-reveal="120" class="mock" aria-hidden="true">
        <div class="mock__bar"><i /><i /><i /><span>Classic Plus LK Launcher</span></div>
        <div class="mock__body">
          <aside class="mock__side">
            <SiteLogo compact :size="40" />
            <span class="mock__nav is-active" /><span class="mock__nav" /><span class="mock__nav" />
          </aside>
          <div class="mock__main">
            <div class="mock__banner"><span>Wrath of the Lich King</span><b>Classic Plus</b></div>
            <div class="mock__clients">
              <span class="mock__client">32-bit</span>
              <span class="mock__client is-sel">64-bit</span>
            </div>
            <div class="mock__progress"><span /></div>
            <div class="mock__foot">
              <small>Verifying files…</small>
              <span class="mock__play">Play</span>
            </div>
          </div>
        </div>
        <StageBadge class="mock__badge" :value="site.launcher.status" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.lnc__grid { display: grid; grid-template-columns: 1fr 1.1fr; gap: clamp(32px, 6vw, 72px); align-items: center; }
.lnc__copy > p { color: var(--text-300); }
.lnc__perks { list-style: none; padding: 0; margin: 22px 0 32px; display: grid; grid-template-columns: 1fr 1fr; gap: 12px 20px; }
.lnc__perks li { display: flex; gap: 10px; align-items: center; color: var(--text-100); font-size: .94rem; }
.lnc__perks svg { color: var(--ice-300); flex: none; }
.lnc__dl { display: flex; flex-wrap: wrap; gap: 12px; }

.mock { position: relative; border-radius: 10px; overflow: hidden; background: #070d15; border: 1px solid rgba(212, 168, 69, .35); box-shadow: 0 40px 80px -30px rgba(0, 0, 0, .9), 0 0 60px -20px var(--ice-glow); transform: perspective(1400px) rotateY(-8deg) rotateX(3deg); transition: transform .6s var(--ease); }
.mock:hover { transform: perspective(1400px) rotateY(-3deg) rotateX(1deg); }
.mock__bar { display: flex; align-items: center; gap: 6px; padding: 10px 14px; background: #0b1520; border-bottom: 1px solid var(--line); font-size: .72rem; color: var(--text-400); }
.mock__bar i { width: 9px; height: 9px; border-radius: 50%; background: #233447; }
.mock__bar span { margin-left: 10px; letter-spacing: .1em; }
.mock__body { display: grid; grid-template-columns: 72px 1fr; min-height: 300px; }
.mock__side { display: grid; justify-items: center; align-content: start; gap: 14px; padding: 16px 0; background: #060b11; border-right: 1px solid var(--line); }
.mock__nav { width: 28px; height: 6px; border-radius: 3px; background: #1a2a3b; }
.mock__nav.is-active { background: var(--gold-400); }
.mock__main { padding: 18px; display: grid; gap: 16px; align-content: start; }
.mock__banner { height: 120px; border-radius: 6px; padding: 16px; display: grid; align-content: end; background: radial-gradient(circle at 70% 30%, rgba(127, 203, 255, .5), transparent 50%), linear-gradient(135deg, #12304a, #050b12); border: 1px solid var(--line); }
.mock__banner span { font-size: .66rem; letter-spacing: .2em; text-transform: uppercase; color: var(--ice-200); }
.mock__banner b { font: 700 1.4rem/1.1 var(--font-display); color: var(--gold-200); }
.mock__clients { display: flex; gap: 8px; }
.mock__client { padding: 7px 12px; border-radius: 4px; font-size: .74rem; font-weight: 600; border: 1px solid var(--line-strong); color: var(--text-300); }
.mock__client.is-sel { border-color: var(--ice-300); color: #fff; background: rgba(79, 179, 247, .18); }
.mock__progress { height: 6px; border-radius: 3px; background: #132232; overflow: hidden; }
.mock__progress span { display: block; height: 100%; width: 64%; background: linear-gradient(90deg, var(--ice-500), var(--ice-200)); box-shadow: 0 0 12px var(--ice-glow); }
.mock__foot { display: flex; justify-content: space-between; align-items: center; }
.mock__foot small { color: var(--text-400); }
.mock__play { padding: 10px 28px; border-radius: 4px; font: 700 .8rem/1 var(--font-display); letter-spacing: .16em; text-transform: uppercase; color: #2a1a04; background: linear-gradient(180deg, var(--gold-100), var(--gold-400)); opacity: .55; }
.mock__badge { position: absolute; top: 46px; right: 16px; background: rgba(3, 6, 10, .85); }
@media (max-width: 960px) { .lnc__grid { grid-template-columns: 1fr; } .mock { transform: none; } }
@media (max-width: 480px) { .lnc__perks { grid-template-columns: 1fr; } }
</style>
