<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { site } from '../../config/site.js'
import { fetchRealmStatus } from '../../services/statusService.js'
import AppIcon from '../ui/AppIcon.vue'

const data = ref({ live: false, status: site.realm.status, playersOnline: null, totalAccounts: null })
let timer

function computePlayers(rawCount, isOnline) {
  if (rawCount == null || !isOnline) return rawCount
  // O backend soma 20 bots residentes: rawCount = 20 + playersReais
  const realHumans = Math.max(0, rawCount - 20)
  // Numero randomico de 10 ate 20 bots para variacao natural a cada carregamento
  const randomBots = Math.floor(Math.random() * (20 - 10 + 1)) + 10
  return randomBots + realHumans
}

async function load() {
  const res = await fetchRealmStatus()
  if (res.playersOnline != null && res.status === 'online') {
    res.playersOnline = computePlayers(res.playersOnline, true)
  }
  data.value = res
}
onMounted(() => {
  load()
  if (site.realm.statusUrl) timer = setInterval(load, site.realm.statusRefreshMs)
})
onBeforeUnmount(() => clearInterval(timer))

const STATUS_LABEL = { online: 'Online', offline: 'Offline', maintenance: 'Maintenance' }
const fmt = (n) => (n == null ? '—' : new Intl.NumberFormat('en-US').format(n))
</script>

<template>
  <section id="status" class="status" aria-labelledby="status-title">
    <div class="container">
      <div v-reveal class="status__bar panel">
        <h2 id="status-title" class="sr-only">Realm status</h2>

        <div class="status__item">
          <span class="status__label">Realm · {{ site.realm.name }}</span>
          <span class="status__value status__realm" :class="`is-${data.status}`">
            <span class="status__dot" aria-hidden="true" />{{ STATUS_LABEL[data.status] ?? 'Unknown' }}
          </span>
          <span v-if="site.realm.latencyMs || site.realm.region" class="status__sub">
            {{ site.realm.region }}<template v-if="site.realm.latencyMs"> · ~{{ site.realm.latencyMs }} ms</template>
          </span>
        </div>
        <div class="status__item">
          <span class="status__label">Players Online</span>
          <span class="status__value">{{ fmt(data.playersOnline) }}</span>
        </div>
        <div class="status__item">
          <span class="status__label">Total Accounts</span>
          <span class="status__value">{{ fmt(data.totalAccounts) }}</span>
        </div>
        <div class="status__item">
          <span class="status__label">Game Version</span>
          <span class="status__value status__version">{{ site.game.expansion }} <b>{{ site.game.version }}</b></span>
        </div>
      </div>
      <p class="status__note">
        <AppIcon name="info" :size="14" />
        <template v-if="data.live">Live data from the {{ site.game.core }} realm, counting resident bots.</template>
        <template v-else>Live player and account counts will appear here once the realm statistics feed is connected. No numbers are simulated.</template>
      </p>
    </div>
  </section>
</template>

<style scoped>
.status { position: relative; margin-top: -88px; z-index: 2; }
.status__bar { display: grid; grid-template-columns: repeat(4, 1fr); padding: 0; background: linear-gradient(180deg, rgba(14, 26, 40, .92), rgba(6, 11, 18, .96)); backdrop-filter: blur(10px); }
.status__item { display: grid; gap: 8px; padding: 24px 28px; border-left: 1px solid var(--line); }
.status__item:first-child { border-left: 0; }
.status__label { font: 600 .68rem/1 var(--font-body); letter-spacing: .2em; text-transform: uppercase; color: var(--text-400); }
.status__value { font: 700 1.45rem/1.1 var(--font-display); color: var(--text-100); display: inline-flex; align-items: center; gap: 10px; }
.status__version { font-size: 1rem; color: var(--text-200); flex-wrap: wrap; }
.status__version b { color: var(--gold-300); }
.status__sub { font-size: .8rem; color: var(--text-300); }
.status__dot { width: 10px; height: 10px; border-radius: 50%; background: currentColor; box-shadow: 0 0 0 4px color-mix(in srgb, currentColor 20%, transparent), 0 0 14px currentColor; }
.status__realm.is-online { color: var(--ok); }
.status__realm.is-online .status__dot { animation: pulse 2s ease-in-out infinite; }
.status__realm.is-offline { color: var(--text-300); }
.status__realm.is-maintenance { color: var(--warn); }
@keyframes pulse { 50% { box-shadow: 0 0 0 7px transparent, 0 0 18px currentColor; } }
.status__note { display: flex; align-items: center; justify-content: center; gap: 8px; margin: 14px 0 0; font-size: .8rem; color: var(--text-400); text-align: center; }
@media (max-width: 860px) {
  .status { margin-top: -56px; }
  .status__bar { grid-template-columns: 1fr 1fr; }
  .status__item:nth-child(3) { border-left: 0; }
  .status__item:nth-child(n + 3) { border-top: 1px solid var(--line); }
}
@media (max-width: 560px) {
  .status { margin-top: -32px; }
  .status__bar { grid-template-columns: 1fr; }
  .status__item { padding: 16px 20px; border-left: 0; border-top: 1px solid var(--line); }
  .status__item:first-child { border-top: 0; }
  .status__item:nth-child(n + 2) { border-top: 1px solid var(--line); }
  .status__value { font-size: 1.25rem; }
  .status__note { font-size: .75rem; padding: 0 8px; }
}
</style>
