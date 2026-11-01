/**
 * Realm status. Without VITE_STATUS_URL it returns the configured state and
 * `live: false`, so the UI never presents placeholder numbers as real stats.
 * Expected endpoint JSON: { online: boolean, playersOnline: number, totalAccounts: number }
 */
import { site } from '../config/site.js'

export async function fetchRealmStatus() {
  const fallback = {
    live: false,
    status: site.realm.status,
    playersOnline: null,
    totalAccounts: null
  }
  if (!site.realm.statusUrl) return fallback
  try {
    const res = await fetch(site.realm.statusUrl, { headers: { Accept: 'application/json' } })
    if (!res.ok) throw new Error(String(res.status))
    const d = await res.json()
    return {
      live: true,
      status: d.online ? 'online' : 'offline',
      playersOnline: Number.isFinite(d.playersOnline) ? d.playersOnline : null,
      totalAccounts: Number.isFinite(d.totalAccounts) ? d.totalAccounts : null
    }
  } catch {
    return { ...fallback, error: true }
  }
}
