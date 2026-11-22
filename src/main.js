import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'
import { vReveal } from './composables/reveal.js'
import { revalidateSession, consumeSsoHash } from './services/session.js'
import { initBackendDiscovery } from './services/backendDiscovery.js'
import './styles/tokens.css'
import './styles/base.css'
import './styles/components.css'

initBackendDiscovery().finally(async () => {
  const ssoOk = await consumeSsoHash()
  if (!ssoOk) await revalidateSession()
})

createApp(App).use(router).directive('reveal', vReveal).mount('#app')
