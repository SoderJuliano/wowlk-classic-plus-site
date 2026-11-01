import { reactive, readonly } from 'vue'
import { site, RELEASE } from '../config/site.js'

const state = reactive({ open: false, clientId: null })

/**
 * Single entry point for every "Download" button.
 * If the client is available AND has a configured URL, navigate to it.
 * Otherwise open the "downloads are being prepared" dialog — never a fake link.
 */
export function useDownloadModal() {
  function requestDownload(clientId = null) {
    const client = clientId ? site.downloads[clientId] : null
    if (client && client.status !== RELEASE.COMING_SOON && client.url) {
      window.location.assign(client.url)
      return
    }
    state.clientId = clientId
    state.open = true
  }
  const close = () => { state.open = false }
  return { state: readonly(state), requestDownload, close }
}
