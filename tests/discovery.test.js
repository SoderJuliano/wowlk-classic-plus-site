import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { applyBaseUrl, fetchTunnelUrl, initBackendDiscovery, ensureBackendReady, resetDiscovery, backendUrl } from '../src/services/backendDiscovery.js'
import { site } from '../src/config/site.js'

describe('backend discovery via Abra API', () => {
  beforeEach(() => {
    vi.unstubAllGlobals()
    resetDiscovery()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    resetDiscovery()
  })

  it('applies base URL to site config and sets auth and donation endpoints', () => {
    const ok = applyBaseUrl('https://my-ngrok.ngrok-free.dev/')
    expect(ok).toBe(true)
    expect(backendUrl.value).toBe('https://my-ngrok.ngrok-free.dev')
    expect(site.auth.apiUrl).toBe('https://my-ngrok.ngrok-free.dev/launcher/v1')
    expect(site.donation.apiUrl).toBe('https://my-ngrok.ngrok-free.dev/donation/v1')
    expect(site.realm.statusUrl).toBe('https://my-ngrok.ngrok-free.dev/launcher/v1/status')
  })

  it('fetches latest URL from Abra API notifications array', async () => {
    const fetchMock = vi.fn(async () => ({
      ok: true,
      json: async () => [
        { key: 'ngrockurl', content: 'https://old-tunnel.ngrok-free.dev' },
        { key: 'ngrockurl', content: 'https://bush-wifi-wanting.ngrok-free.dev' }
      ]
    }))
    vi.stubGlobal('fetch', fetchMock)

    const url = await fetchTunnelUrl()
    expect(url).toBe('https://bush-wifi-wanting.ngrok-free.dev')
  })

  it('ensures backend URL is discovered and resolves successfully', async () => {
    const fetchMock = vi.fn(async () => ({
      ok: true,
      json: async () => [
        { key: 'ngrockurl', content: 'https://fresh-ngrok.ngrok-free.dev' }
      ]
    }))
    vi.stubGlobal('fetch', fetchMock)

    const readyUrl = await ensureBackendReady()
    expect(readyUrl).toContain('/launcher/v1')
    expect(site.auth.apiUrl).toBe('https://fresh-ngrok.ngrok-free.dev/launcher/v1')
  })
})
