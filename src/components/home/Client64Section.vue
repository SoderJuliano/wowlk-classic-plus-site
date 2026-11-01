<script setup>
import { site, STAGE } from '../../config/site.js'
import SectionHead from '../ui/SectionHead.vue'
import AppIcon from '../ui/AppIcon.vue'
import StageBadge from '../ui/StageBadge.vue'
import VideoEmbed from '../ui/VideoEmbed.vue'

const benefits = [
  { icon: 'chip', title: '64-bit Architecture', text: 'A native x86-64 build of the client — not a wrapper around the original 32-bit executable.' },
  { icon: 'memory', title: 'Better Memory Usage', text: 'Free from the ~4 GB address-space ceiling of 32-bit processes, which caps textures, view distance and addons.' },
  { icon: 'bolt', title: 'Modern Optimizations', text: 'Built with modern compilers and instruction sets, opening room for optimizations the 2010 binary never had.' },
  { icon: 'gauge', title: 'Better Performance Potential', text: 'More headroom for high refresh rates, crowded cities and large-scale PvP as development progresses.' },
  { icon: 'layers', title: 'Foundation for Advanced Graphics', text: 'A technical base for rendering improvements that are not practical inside the traditional client.' },
  { icon: 'unlock', title: 'Freedom to Evolve', text: 'Owning the client build gives the project room to fix, improve and extend it over time.' },
  { icon: 'upscale', title: 'Planned Upscaling Support', text: 'Compatibility with modern upscaling technologies is planned for the 64-bit client.' }
]
</script>

<template>
  <section id="client64" class="section c64" aria-labelledby="c64-title">
    <div class="c64__glow" aria-hidden="true" />
    <div class="c64__grid-bg" aria-hidden="true" />
    <div class="container">
      <SectionHead
        id="c64-title"
        eyebrow="Our biggest leap"
        title="A New Generation of Wrath of the Lich King"
        subtitle="Introducing a Native 64-bit WoW Client."
        frost
      >
        <p>
          We are developing a new generation of the Wrath of the Lich King client — a native 64-bit architecture,
          compiled to deliver a modern experience on today's operating systems. A capability that sets the project
          apart from the traditional 32-bit clients used across private servers.
        </p>
        <StageBadge :value="STAGE.IN_DEVELOPMENT" />
      </SectionHead>

      <!-- Platforms -->
      <div class="plats">
        <article
          v-for="(p, i) in site.platforms64" :key="p.id" v-reveal="i * 100"
          class="plat panel" :class="{ 'plat--hero panel--frost': p.highlight, 'plat--planned': p.stage === STAGE.PLANNED }"
        >
          <span v-if="p.highlight" class="plat__ribbon">Native build</span>
          <div class="plat__icon"><AppIcon :name="p.id" :size="p.highlight ? 56 : 46" :label="p.name" /></div>
          <h3>{{ p.name }}</h3>
          <p class="plat__line">{{ p.line }}</p>
          <p v-if="p.id === 'linux'" class="plat__extra">
            Compiled natively for Linux — it does not depend exclusively on Wine or Proton.
            An early build is already running natively.
          </p>
          <p v-if="p.stage === STAGE.PLANNED" class="plat__extra">On the roadmap. Not available yet — no release date announced.</p>
          <StageBadge :value="p.stage" />
        </article>
      </div>

      <!-- Early build footage -->
      <div v-reveal class="early">
        <div class="early__copy">
          <p class="eyebrow">Work in progress</p>
          <h3 class="title-lg frost-text">Already Running on Linux</h3>
          <p>
            A first, still-in-construction version of the 64-bit client running natively on Linux —
            with <strong>ray tracing</strong> and <strong>FSR</strong> enabled.
          </p>
          <p class="early__small">Early development footage. Visuals, performance and features will change before release.</p>
        </div>
        <VideoEmbed v-bind="site.videos.nativeLinux" />
      </div>

      <!-- Why 64-bit -->
      <div v-reveal class="why panel">
        <div class="why__col">
          <h3 class="why__h"><span class="why__tag">32-bit</span> The traditional ceiling</h3>
          <p>
            The original 3.3.5a client is a 32-bit process from 2010. It can address roughly 4 GB of memory at most,
            relies on aging APIs and can't easily adopt modern rendering techniques — limits that mods and patches can only work around.
          </p>
        </div>
        <div class="why__arrow" aria-hidden="true"><AppIcon name="arrowRight" :size="28" /></div>
        <div class="why__col">
          <h3 class="why__h"><span class="why__tag why__tag--frost">64-bit</span> Room to grow</h3>
          <p>
            A native 64-bit build removes the address-space wall and gives us a modern foundation, opening possibilities
            that aren't available in the same way to traditional clients.
          </p>
        </div>
      </div>

      <!-- Benefits -->
      <div class="grid grid--4 benefits">
        <article v-for="(b, i) in benefits" :key="b.title" v-reveal="(i % 4) * 70" class="ben panel panel--frost panel--hover">
          <AppIcon :name="b.icon" :size="26" class="ben__icon" />
          <h4>{{ b.title }}</h4>
          <p>{{ b.text }}</p>
        </article>
      </div>

      <!-- Upscaling -->
      <div v-reveal class="ups panel">
        <div class="ups__head">
          <h3><AppIcon name="sparkles" :size="22" /> Graphics technologies</h3>
          <p>
            Ray tracing and FSR are already enabled in the early Linux build shown above (experimental). Support for each
            version below is planned or in progress. Availability depends on GPU, drivers, implementation and compatibility.
          </p>
        </div>
        <ul class="ups__list">
          <li v-for="u in site.upscaling" :key="u.id" class="ups__chip" :class="u.id === 'rt' ? 'is-ray' : `is-${u.vendor.toLowerCase()}`">
            <span class="ups__vendor">{{ u.vendor }}</span>
            <span class="ups__name">{{ u.name }}</span>
            <span v-if="u.note" class="ups__note">{{ u.note }}</span>
            <StageBadge :value="u.stage" />
          </li>
        </ul>
        <p class="note">
          <AppIcon name="info" />
          <span>Advanced graphics features and third-party modifications may have varying compatibility during the initial releases.</span>
        </p>
      </div>

      <!-- Two clients -->
      <div class="choice">
        <article v-reveal class="choice__card panel">
          <span class="choice__bits">32<small>-bit</small></span>
          <StageBadge :value="STAGE.LIVE" label="Ready" />
          <h3>Traditional client</h3>
          <p>Kept and maintained for players who prefer the original experience and maximum addon compatibility.</p>
        </article>
        <div class="choice__or" aria-hidden="true">or</div>
        <article v-reveal="100" class="choice__card choice__card--next panel panel--frost">
          <span class="choice__bits frost-text">64<small>-bit</small></span>
          <StageBadge :value="STAGE.IN_DEVELOPMENT" />
          <h3>Next-generation client</h3>
          <p>The future of the project — modern architecture, native Linux, and a path to advanced graphics.</p>
        </article>
      </div>
      <p class="choice__foot">Your choice. The goal is to offer options — never to force anyone onto the experimental client.</p>
    </div>
  </section>
</template>

<style scoped>
.c64 { overflow: hidden; background: linear-gradient(180deg, transparent, rgba(8, 24, 40, .55) 20%, rgba(8, 24, 40, .55) 80%, transparent); }
.c64__glow { position: absolute; left: 50%; top: 0; width: 1100px; height: 700px; transform: translateX(-50%); background: radial-gradient(closest-side, rgba(42, 147, 224, .22), transparent); pointer-events: none; }
.c64__grid-bg {
  position: absolute; inset: 0; pointer-events: none; opacity: .5;
  background-image: linear-gradient(rgba(127, 203, 255, .06) 1px, transparent 1px), linear-gradient(90deg, rgba(127, 203, 255, .06) 1px, transparent 1px);
  background-size: 48px 48px;
  mask-image: radial-gradient(ellipse 60% 50% at 50% 30%, #000, transparent);
}
.container { position: relative; }
:deep(.section-head__body p) { color: var(--text-300); }

.plats { display: grid; grid-template-columns: 1fr 1.25fr 1fr; gap: 20px; align-items: stretch; margin-bottom: 28px; }
.plat { display: grid; justify-items: center; align-content: start; text-align: center; gap: 10px; padding: 34px 24px 28px; }
.plat h3 { font-size: 1.5rem; margin: 6px 0 0; }
.plat__icon { color: var(--text-100); width: 96px; height: 96px; display: grid; place-items: center; border-radius: 50%; background: radial-gradient(circle, rgba(127, 203, 255, .12), transparent 70%); }
.plat__line { color: var(--text-100); font-weight: 600; margin: 0; }
.plat__extra { color: var(--text-300); font-size: .9rem; margin: 0; max-width: 300px; }
.plat--hero { transform: translateY(-10px); box-shadow: 0 0 0 1px rgba(127, 203, 255, .25), 0 0 70px -10px var(--ice-glow), 0 30px 60px -20px rgba(0, 0, 0, .9); background: linear-gradient(180deg, rgba(23, 60, 92, .8), rgba(7, 16, 26, .95)); }
.plat--hero .plat__icon { color: #fff; width: 120px; height: 120px; filter: drop-shadow(0 0 18px rgba(127, 203, 255, .6)); }
.plat--hero h3 { font-size: 1.9rem; }
.plat--planned { opacity: .78; }
.plat--planned .plat__icon { color: var(--text-300); }
.plat__ribbon { position: absolute; top: 14px; left: 50%; transform: translateX(-50%); padding: 5px 12px; border-radius: 0 0 6px 6px; font: 700 .64rem/1 var(--font-body); letter-spacing: .2em; text-transform: uppercase; color: #04121f; background: linear-gradient(180deg, var(--ice-100), var(--ice-300)); top: 0; }

.early { display: grid; grid-template-columns: 1fr 1.35fr; gap: clamp(24px, 4vw, 48px); align-items: center; margin: 12px 0 40px; }
.early__copy p:not(.eyebrow) { color: var(--text-300); }
.early__copy strong { color: var(--ice-100); }
.early__small { font-size: .82rem; color: var(--text-400) !important; font-style: italic; }
.why { display: grid; grid-template-columns: 1fr auto 1fr; gap: 28px; align-items: center; margin-bottom: 28px; }
.why p { color: var(--text-300); margin: 0; font-size: .95rem; }
.why__h { display: flex; align-items: center; gap: 12px; font-size: 1.15rem; }
.why__tag { font: 700 .7rem/1 var(--font-body); letter-spacing: .12em; padding: 6px 9px; border-radius: 4px; border: 1px solid var(--text-400); color: var(--text-300); }
.why__tag--frost { border-color: var(--ice-300); color: var(--ice-100); background: rgba(79, 179, 247, .15); }
.why__arrow { color: var(--gold-300); }

.benefits { margin-bottom: 28px; }
.ben { padding: 24px; }
.ben__icon { color: var(--ice-300); margin-bottom: 14px; }
.ben h4 { font-size: 1.02rem; margin-bottom: 8px; }
.ben p { color: var(--text-300); font-size: .9rem; margin: 0; }

.ups { display: grid; gap: 22px; margin-bottom: 48px; }
.ups__head h3 { display: flex; align-items: center; gap: 10px; font-size: 1.3rem; }
.ups__head h3 svg { color: var(--gold-300); }
.ups__head p { color: var(--text-300); margin: 0; }
.ups__list { list-style: none; padding: 0; margin: 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 14px; }
.ups__chip { display: grid; gap: 6px; padding: 18px; border-radius: var(--radius); background: rgba(3, 6, 10, .6); border: 1px solid var(--line); justify-items: start; }
.ups__chip.is-amd { border-top: 2px solid #ed1c24; }
.ups__chip.is-nvidia { border-top: 2px solid #76b900; }
.ups__chip.is-ray { border-top: 2px solid var(--ice-300); background: rgba(79, 179, 247, .08); }
.ups__note { font-size: .78rem; color: var(--ice-200); }
.ups__vendor { font: 700 .7rem/1 var(--font-body); letter-spacing: .22em; color: var(--text-400); }
.ups__name { font: 700 1.45rem/1 var(--font-display); color: var(--text-100); margin-bottom: 4px; }

.choice { display: grid; grid-template-columns: 1fr auto 1fr; gap: 20px; align-items: center; }
.choice__card { text-align: center; padding: 32px; }
.choice__card h3 { font-size: 1.3rem; margin-top: 12px; }
.choice__card p { color: var(--text-300); margin: 0; }
.choice__bits { display: block; font: 900 3.2rem/1 var(--font-deco); color: var(--text-200); margin-bottom: 10px; }
.choice__bits small { font-size: .4em; letter-spacing: .1em; }
.choice__card--next { box-shadow: 0 0 60px -20px var(--ice-glow); }
.choice__or { font: 700 .8rem/1 var(--font-display); letter-spacing: .2em; text-transform: uppercase; color: var(--gold-300); width: 48px; height: 48px; display: grid; place-items: center; border-radius: 50%; border: 1px solid var(--gold-500); background: var(--bg-900); }
.choice__foot { text-align: center; color: var(--text-300); margin: 22px 0 0; font-style: italic; }

@media (max-width: 960px) {
  .plats { grid-template-columns: 1fr; }
  .plat--hero { transform: none; order: -1; }
  .why, .choice, .early { grid-template-columns: 1fr; }
  .why__arrow { transform: rotate(90deg); justify-self: center; }
  .choice__or { justify-self: center; }
}
</style>
