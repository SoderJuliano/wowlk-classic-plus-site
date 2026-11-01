import { reactive, readonly } from 'vue'
import { site, RELEASE } from '../config/site.js'

const state = reactive({ open: false, clientId: null })

/**
 * Single entry point for every "Download" button. Opens the dialog, which shows the
 * launcher downloads (Windows / Linux) when available, or the "coming soon" message
 * for clients that are not released yet (e.g. 64-bit).
 */
export const launcherReady = () => site.launcher.status === RELEASE.AVAILABLE && !!(site.launcher.windowsUrl || site.launcher.linuxUrl)

export function useDownloadModal() {
  function requestDownload(clientId = null) {
    state.clientId = clientId
    state.open = true
  }
  const close = () => { state.open = false }
  return { state: readonly(state), requestDownload, close }
}
