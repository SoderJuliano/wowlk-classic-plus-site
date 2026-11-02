<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRoute } from 'vue-router'
import SiteLogo from '../ui/SiteLogo.vue'
import AppIcon from '../ui/AppIcon.vue'
import { NAV_LINKS } from './navLinks.js'
import { session, endSession } from '../../services/session.js'

const scrolled = ref(false)
const open = ref(false)
const route = useRoute()

const onScroll = () => { scrolled.value = window.scrollY > 24 }
onMounted(() => { onScroll(); window.addEventListener('scroll', onScroll, { passive: true }) })
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
watch(() => route.fullPath, () => { open.value = false })
watch(open, (v) => document.body.style.setProperty('overflow', v ? 'hidden' : ''))
</script>

<template>
  <header class="hdr" :class="{ 'hdr--solid': scrolled || open || route.name !== 'home' }">
    <div class="hdr__inner container">
      <RouterLink to="/" class="hdr__brand" aria-label="WoW Classic Plus LK — home"><SiteLogo :size="42" /></RouterLink>

      <nav id="main-nav" class="hdr__nav" :class="{ 'is-open': open }" aria-label="Main">
        <ul>
          <li v-for="l in NAV_LINKS" :key="l.label">
            <RouterLink :to="l.to" class="hdr__link">{{ l.label }}</RouterLink>
          </li>
        </ul>
        <div class="hdr__actions">
          <template v-if="session">
            <span class="hdr__link hdr__user"><AppIcon name="user" :size="16" /> {{ session.username }}</span>
            <button type="button" class="btn btn--ghost btn--sm" @click="endSession">Log Out</button>
          </template>
          <template v-else>
            <RouterLink :to="{ name: 'login' }" class="hdr__link hdr__login"><AppIcon name="lock" :size="16" /> Login</RouterLink>
            <RouterLink :to="{ name: 'register' }" class="btn btn--gold btn--sm">Create Account</RouterLink>
          </template>
        </div>
      </nav>

      <button
        class="hdr__toggle" type="button" :aria-expanded="open" aria-controls="main-nav"
        :aria-label="open ? 'Close menu' : 'Open menu'" @click="open = !open"
      >
        <AppIcon :name="open ? 'close' : 'menu'" :size="26" />
      </button>
    </div>
  </header>
</template>

<style scoped>
.hdr {
  position: fixed; inset: 0 0 auto; z-index: 50; height: var(--header-h);
  transition: background .35s var(--ease), border-color .35s var(--ease), backdrop-filter .35s;
  border-bottom: 1px solid transparent;
}
.hdr--solid {
  background: rgba(5, 10, 16, .82); backdrop-filter: blur(14px) saturate(1.2);
  border-bottom-color: rgba(212, 168, 69, .18);
  box-shadow: 0 10px 30px -15px rgba(0, 0, 0, .8);
}
.hdr__inner { height: 100%; display: flex; align-items: center; justify-content: space-between; gap: 24px; }
.hdr__brand { flex: none; }
.hdr__nav { display: flex; align-items: center; gap: 28px; }
.hdr__nav ul { display: flex; gap: 4px; list-style: none; margin: 0; padding: 0; }
.hdr__link {
  position: relative; display: inline-flex; align-items: center; gap: 6px; padding: 10px 12px;
  font: 600 .78rem/1 var(--font-display); letter-spacing: .14em; text-transform: uppercase; color: var(--text-200);
}
.hdr__link::after {
  content: ''; position: absolute; left: 12px; right: 12px; bottom: 4px; height: 1px;
  background: linear-gradient(90deg, transparent, var(--gold-300), transparent);
  transform: scaleX(0); transition: transform .3s var(--ease);
}
.hdr__link:hover { color: var(--gold-100); }
.hdr__user { color: var(--gold-100); cursor: default; }
.hdr__user::after { display: none; }
.hdr__link:hover::after { transform: scaleX(1); }
.hdr__actions { display: flex; align-items: center; gap: 10px; }
.hdr__toggle { display: none; background: none; border: 1px solid var(--line-strong); color: var(--text-100); border-radius: 6px; padding: 6px; cursor: pointer; }

@media (max-width: 1080px) {
  /* backdrop-filter would make the header the containing block of the fixed menu panel and cut it off. */
  .hdr--solid { backdrop-filter: none; background: rgba(5, 10, 16, .97); }
  .hdr__toggle { display: inline-flex; }
  .hdr__nav {
    position: fixed; inset: var(--header-h) 0 0; flex-direction: column; align-items: stretch; gap: 24px;
    padding: 28px 24px; background: rgba(4, 8, 13, .97); backdrop-filter: blur(10px);
    transform: translateY(-8px); opacity: 0; visibility: hidden; transition: opacity .25s var(--ease), transform .25s var(--ease), visibility .25s;
    overflow-y: auto;
  }
  .hdr__nav.is-open { opacity: 1; transform: none; visibility: visible; }
  .hdr__nav ul { flex-direction: column; }
  .hdr__link { padding: 16px 4px; font-size: .95rem; border-bottom: 1px solid var(--line); }
  .hdr__link::after { display: none; }
  .hdr__actions { flex-direction: column; align-items: stretch; }
  .hdr__actions .btn { --h: 52px; }
  .hdr__user { justify-content: center; border-bottom: 0; }
  .hdr__login { justify-content: center; border: 1px solid var(--line-strong); border-radius: 4px; }
}
</style>
