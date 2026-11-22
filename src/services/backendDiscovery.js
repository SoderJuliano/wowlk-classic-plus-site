import { ref } from 'vue'
import { site, donationUrlFrom } from '../config/site.js'

const CACHE_KEY = 'wowlk.pikachu_url'
const DISCOVERY_KEY = 'ngrockurl'

export const backendUrl = ref('')
export const isDiscovering = ref(false)

let discoveryPromise = null

export function cleanUrl(url) {
  if (!url || typeof url !== 'string') return ''
  return url.trim().replace(/\/+$/, '')
}

export function applyBaseUrl(rawUrl) {
  const base = cleanUrl(rawUrl)
  if (!base || !base.startsWith('http')) return false
  backendUrl.value = base
  site.auth.apiUrl = `${base}/launcher/v1`
  site.donation.apiUrl = donationUrlFrom(site.auth.apiUrl) || `${base}/donation/v1`
  if (!site.realm.statusUrl && base) {
    site.realm.statusUrl = `${base}/launcher/v1/status`
  }
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(CACHE_KEY, base)
    }
  } catch {}
  return true
}

export async function fetchTunnelUrl(timeoutMs = 6000) {
  const abraBase = site.abra?.baseUrl || 'https://abra-api.top'
  const registryUrl = `${abraBase}/notifications/retrieve?key=${DISCOVERY_KEY}&_t=${Date.now()}`
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), timeoutMs)
  try {
    const res = await fetch(registryUrl, {
      method: 'GET',
      signal: ctrl.signal
    })
    if (!res.ok) return null
    const data = await res.json()
    if (Array.isArray(data) && data.length > 0) {
      const last = data[data.length - 1]
      const url = cleanUrl(last?.content)
      if (url && url.startsWith('http')) return url
    }
  } catch (e) {
    console.warn('[backend-discovery] registry unavailable:', e?.message)
  } finally {
    clearTimeout(timer)
  }
  return null
}

export function initBackendDiscovery() {
  if (typeof window === 'undefined') return Promise.resolve(backendUrl.value)

  // 1. Try cache immediately for instant interaction
  try {
    const cached = localStorage.getItem(CACHE_KEY)
    if (cached) {
      applyBaseUrl(cached)
    }
  } catch {}

  // 2. If a non-ngrok override is hardcoded in .env (e.g. localhost testing), keep it
  if (site.auth.apiUrl && !site.auth.apiUrl.includes('.ngrok')) {
    const staticBase = site.auth.apiUrl.replace(/\/launcher\/v1\/?$/, '')
    if (staticBase) {
      backendUrl.value = staticBase
      return Promise.resolve(staticBase)
    }
  }

  // 3. Query Abra API for the active tunnel URL
  if (discoveryPromise) return discoveryPromise

  isDiscovering.value = true
  discoveryPromise = fetchTunnelUrl()
    .then((freshUrl) => {
      if (freshUrl) {
        applyBaseUrl(freshUrl)
      }
      return backendUrl.value
    })
    .finally(() => {
      isDiscovering.value = false
    })

  return discoveryPromise
}

export async function ensureBackendReady(timeoutMs = 7000) {
  if (site.auth.apiUrl) return site.auth.apiUrl
  if (!discoveryPromise) initBackendDiscovery()
  const timeoutPromise = new Promise((resolve) => setTimeout(resolve, timeoutMs))
  await Promise.race([discoveryPromise, timeoutPromise])
  return site.auth.apiUrl
}

export function resetDiscovery() {
  discoveryPromise = null
  isDiscovering.value = false
  backendUrl.value = ''
  site.auth.apiUrl = ''
  site.donation.apiUrl = ''
  site.realm.statusUrl = ''
  try {
    if (typeof localStorage !== 'undefined') localStorage.removeItem(CACHE_KEY)
  } catch {}
}
