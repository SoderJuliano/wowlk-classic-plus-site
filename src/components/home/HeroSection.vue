<script setup>
import NorthrendScene from '../ui/NorthrendScene.vue'
import AppIcon from '../ui/AppIcon.vue'
import { site } from '../../config/site.js'
import { useDownloadModal } from '../../composables/useDownloadModal.js'

const { requestDownload } = useDownloadModal()
</script>

<template>
  <section id="top" class="hero" aria-labelledby="hero-title">
    <div class="hero__art"><NorthrendScene /></div>
    <div class="hero__snow" aria-hidden="true" />
    <div class="hero__vignette" aria-hidden="true" />

    <div class="hero__content container">
      <p class="hero__kicker">
        <span>{{ site.game.expansion }}</span><i aria-hidden="true">◆</i><span>{{ site.game.version }}</span><i aria-hidden="true">◆</i><span>Free to Play</span>
      </p>
      <h1 id="hero-title" class="hero__title">
        <span class="hero__wow">WoW</span>
        <span class="hero__main">Classic Plus <em>LK</em></span>
      </h1>
      <p class="hero__sub">{{ site.tagline }}</p>
      <p class="hero__text">
        Rediscover the world of Azeroth. Experience the legendary Wrath of the Lich King with carefully redesigned
        gameplay, improved early progression, modernized visuals and continuous development.
      </p>
      <div class="hero__cta">
        <RouterLink :to="{ name: 'register' }" class="btn btn--gold btn--lg"><AppIcon name="user" /> Create Account</RouterLink>
        <button type="button" class="btn btn--frost btn--lg hero__dl" @click="requestDownload()">
          <AppIcon name="download" /> Download Game
        </button>
      </div>
      <ul class="hero__pills" aria-label="Project principles">
        <li><AppIcon name="shield" :size="16" /> No Pay to Win</li>
        <li><AppIcon name="hourglass" :size="16" /> Original XP rates</li>
        <li v-if="site.realm.status === 'online'" class="is-live">
          <span class="dot" aria-hidden="true" /> Realm online<template v-if="site.realm.latencyMs"> · ~{{ site.realm.latencyMs }} ms</template>
        </li>
        <li><AppIcon name="chip" :size="16" /> Native 64-bit client in development</li>
      </ul>
    </div>

    <a href="#status" class="hero__scroll" aria-label="Scroll to realm status"><span /></a>
  </section>
</template>

<style scoped>
.hero { position: relative; min-height: clamp(680px, 100svh, 1100px); display: grid; align-items: center; overflow: hidden; padding: calc(var(--header-h) + 40px) 0 140px; }
.hero__art { position: absolute; inset: 0; z-index: -3; -webkit-mask-image: linear-gradient(#000 82%, transparent); mask-image: linear-gradient(#000 82%, transparent); }
.hero__vignette { position: absolute; inset: 0; z-index: -1; pointer-events: none; background: radial-gradient(ellipse 70% 60% at 50% 42%, transparent 30%, rgba(2, 5, 9, .65) 100%), linear-gradient(180deg, rgba(2, 5, 9, .55), transparent 30%); }
.hero__snow {
  position: absolute; inset: -100% 0 0; z-index: -2; pointer-events: none; opacity: .55;
  background-image:
    radial-gradient(1.5px 1.5px at 20px 30px, #fff, transparent),
    radial-gradient(1px 1px at 90px 120px, #e8f6ff, transparent),
    radial-gradient(2px 2px at 160px 60px, #fff, transparent),
    radial-gradient(1px 1px at 230px 180px, #d6efff, transparent),
    radial-gradient(1.5px 1.5px at 300px 90px, #fff, transparent);
  background-size: 320px 220px;
  animation: snow 28s linear infinite;
}
@keyframes snow { to { transform: translate3d(-60px, 50%, 0); } }

.hero__content { text-align: center; display: grid; justify-items: center; }
.hero__kicker { display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; font: 600 .74rem/1 var(--font-body); letter-spacing: .3em; text-transform: uppercase; color: var(--ice-200); margin-bottom: 28px; }
.hero__kicker i { font-style: normal; color: var(--gold-400); font-size: .55rem; align-self: center; }
.hero__title { display: grid; margin: 0; line-height: .95; text-transform: uppercase; }
.hero__wow { font: 700 clamp(1rem, 2.2vw, 1.4rem)/1 var(--font-display); letter-spacing: .7em; padding-left: .7em; color: var(--gold-300); margin-bottom: 14px; }
.hero__main {
  font: 900 clamp(2.6rem, 8.4vw, 6.4rem)/0.95 var(--font-deco); letter-spacing: .02em;
  background: linear-gradient(180deg, #ffffff 0%, #d6efff 38%, #7fcbff 70%, #2a93e0 100%);
  -webkit-background-clip: text; background-clip: text; color: transparent;
  filter: drop-shadow(0 4px 0 rgba(0, 0, 0, .6)) drop-shadow(0 0 34px rgba(95, 190, 255, .45));
}
.hero__main em {
  font-style: normal;
  background: linear-gradient(180deg, #fff1c9, #e9c46a 50%, #9a6f22);
  -webkit-background-clip: text; background-clip: text; color: transparent;
}
.hero__sub { margin: 26px 0 14px; font: 600 clamp(1.2rem, 2.6vw, 1.75rem)/1.2 var(--font-display); color: var(--gold-100); letter-spacing: .06em; text-shadow: 0 2px 12px rgba(0, 0, 0, .8); }
.hero__text { max-width: 680px; color: var(--text-200); font-size: clamp(1rem, 1.6vw, 1.12rem); text-shadow: 0 1px 10px rgba(0, 0, 0, .9); }
.hero__cta { display: flex; flex-wrap: wrap; justify-content: center; gap: 16px; margin-top: 20px; }
.hero__dl { --h: 62px; padding: 0 40px; font-size: .98rem; }
.hero__pills { list-style: none; padding: 0; margin: 34px 0 0; display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; }
.hero__pills li { display: inline-flex; align-items: center; gap: 8px; padding: 8px 14px; border-radius: 999px; font-size: .82rem; color: var(--text-200); background: rgba(5, 10, 16, .55); border: 1px solid var(--line); backdrop-filter: blur(6px); }
.hero__pills svg { color: var(--ice-300); }
.hero__pills .is-live { color: #c8f7de; border-color: rgba(95, 224, 160, .45); }
.hero__pills .dot { width: 8px; height: 8px; border-radius: 50%; background: var(--ok); box-shadow: 0 0 10px var(--ok); }
.hero__scroll { position: absolute; left: 50%; bottom: 96px; transform: translateX(-50%); width: 26px; height: 42px; border: 1.5px solid rgba(214, 239, 255, .45); border-radius: 14px; }
.hero__scroll span { position: absolute; left: 50%; top: 8px; width: 3px; height: 8px; margin-left: -1.5px; border-radius: 2px; background: var(--ice-200); animation: wheel 2s var(--ease) infinite; }
@keyframes wheel { 0% { opacity: 0; transform: translateY(0); } 30% { opacity: 1; } 100% { opacity: 0; transform: translateY(14px); } }
@media (max-width: 640px) { .hero__cta { width: 100%; flex-direction: column; } .hero__cta .btn { width: 100%; } .hero__scroll { display: none; } }
</style>
