import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

const REQUIRED = ['VITE_QUEUE_REGISTRATION_KEY', 'VITE_QUEUE_EVENTS_KEY']

export default defineConfig(({ command, mode }) => {
  // Fail fast: a production build without queue keys would ship a broken sign-up.
  if (command === 'build') {
    const env = loadEnv(mode, process.cwd(), 'VITE_')
    const missing = REQUIRED.filter((k) => !env[k])
    if (missing.length) throw new Error(`Missing ${missing.join(', ')} — add them to .env (see .env.example).`)
  }
  return {
  plugins: [vue()],
  build: {
    target: 'es2020',
    cssCodeSplit: true
  },
  test: {
    environment: 'jsdom',
    include: ['tests/**/*.test.js'],
    // Tests never touch the real queue keys from .env
    env: { VITE_QUEUE_REGISTRATION_KEY: 'test-registration-key', VITE_QUEUE_EVENTS_KEY: 'test-events-key' }
  }
  }
})
