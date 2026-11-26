import { ref, onMounted, onBeforeUnmount } from 'vue'
import { site } from '../config/site.js'
import { fetchRealmStatus } from '../services/statusService.js'

function computePlayers(rawCount, isOnline) {
  if (rawCount == null || !isOnline) return rawCount
  // O backend soma 20 bots residentes: rawCount = 20 + playersReais
  const realHumans = Math.max(0, rawCount - 20)
  // Numero randomico de 10 ate 20 bots para variacao natural a cada carregamento
  const randomBots = Math.floor(Math.random() * (20 - 10 + 1)) + 10
  return randomBots + realHumans
}

export const STATUS_LABEL = { online: 'Online', offline: 'Offline', maintenance: 'Maintenance' }

/** Live realm status, refreshed while the calling component is mounted. */
export function useRealmStatus() {
  const data = ref({ live: false, status: site.realm.status, playersOnline: null, totalAccounts: null })
  let timer

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

  return data
}
