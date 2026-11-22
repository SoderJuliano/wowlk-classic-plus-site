import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'
import { vReveal } from './composables/reveal.js'
import { revalidateSession } from './services/session.js'
import { initBackendDiscovery } from './services/backendDiscovery.js'
import './styles/tokens.css'
import './styles/base.css'
import './styles/components.css'

initBackendDiscovery().finally(() => {
  revalidateSession()
})

createApp(App).use(router).directive('reveal', vReveal).mount('#app')
