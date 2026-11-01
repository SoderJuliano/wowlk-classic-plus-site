<script setup>
import { site, RELEASE } from '../../config/site.js'
import SectionHead from '../ui/SectionHead.vue'
import AppIcon from '../ui/AppIcon.vue'
import StageBadge from '../ui/StageBadge.vue'
import { useDownloadModal } from '../../composables/useDownloadModal.js'

const { requestDownload } = useDownloadModal()
const clients = [site.downloads.client32, site.downloads.client64]
const PLATFORM = { windows: 'Windows', linux: 'Linux' }
</script>

<template>
  <section id="downloads" class="section dls" aria-labelledby="dls-title">
    <div class="container">
      <SectionHead
        id="dls-title"
        eyebrow="Downloads"
        title="Choose Your Adventure"
        subtitle="Two clients. One realm. Your choice."
      />
      <div class="dls__grid">
        <article
          v-for="(c, i) in clients" :key="c.id" v-reveal="i * 120"
          class="dl panel panel--hover" :class="{ 'panel--frost dl--next': c.id === 'client64' }"
        >
          <div class="dl__top">
            <span class="dl__bits" :class="c.id === 'client64' ? 'frost-text' : 'gold-text'">{{ c.id === 'client64' ? '64' : '32' }}<small>-bit</small></span>
            <StageBadge :value="c.status" />
          </div>
          <h3 class="dl__title">{{ c.title }}</h3>
          <p class="dl__sub">{{ c.subtitle }}</p>
          <ul class="dl__plats" aria-label="Platforms">
            <li v-for="p in c.platforms" :key="p"><AppIcon :name="p" :size="20" /> {{ PLATFORM[p] }}</li>
          </ul>
          <button
            type="button" class="btn btn--block"
            :class="c.id === 'client64' ? 'btn--frost' : 'btn--gold'"
            @click="requestDownload(c.id)"
          >
            <AppIcon name="download" />
            {{ c.status === RELEASE.COMING_SOON || !c.url ? 'Notify me at launch' : 'Download' }}
          </button>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.dls__grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 380px), 1fr)); gap: 24px; max-width: 980px; margin: 0 auto; }
.dl { display: grid; gap: 10px; padding: 32px; }
.dl--next { background: linear-gradient(180deg, rgba(21, 52, 80, .75), rgba(6, 13, 21, .95)); box-shadow: 0 0 60px -25px var(--ice-glow); }
.dl__top { display: flex; justify-content: space-between; align-items: center; }
.dl__bits { font: 900 3.4rem/1 var(--font-deco); }
.dl__bits small { font-size: .38em; letter-spacing: .1em; }
.dl__title { font-size: 1.25rem; margin: 10px 0 0; }
.dl__sub { color: var(--text-300); margin: 0; }
.dl__plats { list-style: none; padding: 0; margin: 10px 0 18px; display: flex; gap: 18px; }
.dl__plats li { display: inline-flex; align-items: center; gap: 8px; color: var(--text-100); font-size: .9rem; }
</style>
