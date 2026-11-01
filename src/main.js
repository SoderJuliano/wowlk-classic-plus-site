import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'
import { vReveal } from './composables/reveal.js'
import './styles/tokens.css'
import './styles/base.css'
import './styles/components.css'

createApp(App).use(router).directive('reveal', vReveal).mount('#app')
