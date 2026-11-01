<script setup>
import { site } from '../../config/site.js'
import SiteLogo from '../ui/SiteLogo.vue'
import { NAV_LINKS } from './navLinks.js'

const year = new Date().getFullYear()
</script>

<template>
  <footer class="ftr">
    <div class="container ftr__grid">
      <div class="ftr__brand">
        <SiteLogo :size="52" />
        <p class="ftr__tag">{{ site.tagline }}</p>
        <p class="ftr__meta">{{ site.game.expansion }} {{ site.game.version }} · {{ site.game.pricing }}</p>
      </div>

      <nav aria-label="Footer">
        <h3 class="ftr__h">Explore</h3>
        <ul>
          <li v-for="l in NAV_LINKS" :key="l.label"><RouterLink :to="l.to">{{ l.label }}</RouterLink></li>
        </ul>
      </nav>

      <nav aria-label="Account">
        <h3 class="ftr__h">Account</h3>
        <ul>
          <li><RouterLink :to="{ name: 'register' }">Create Account</RouterLink></li>
          <li><RouterLink :to="{ name: 'login' }">Login</RouterLink></li>
          <li><RouterLink :to="{ name: 'forgot-password' }">Recover Password</RouterLink></li>
        </ul>
      </nav>

      <div>
        <h3 class="ftr__h">Legal</h3>
        <ul>
          <li><RouterLink :to="{ name: 'terms' }">Terms of Use</RouterLink></li>
          <li><RouterLink :to="{ name: 'privacy' }">Privacy Policy</RouterLink></li>
        </ul>
      </div>
    </div>

    <div class="container ftr__bottom">
      <p>© {{ year }} {{ site.name }}. All rights reserved.</p>
      <p class="ftr__disclaimer">
        {{ site.name }} is an independent, non-commercial fan project. It is not affiliated with, endorsed or sponsored by
        Blizzard Entertainment, Inc. World of Warcraft® and Wrath of the Lich King® are trademarks of Blizzard Entertainment, Inc.
      </p>
    </div>
  </footer>
</template>

<style scoped>
.ftr { position: relative; margin-top: 40px; padding: 72px 0 28px; background: linear-gradient(180deg, transparent, rgba(3, 6, 10, .9) 30%); border-top: 1px solid rgba(212, 168, 69, .2); }
.ftr::before { content: ''; position: absolute; top: -1px; left: 50%; transform: translateX(-50%); width: min(520px, 70%); height: 1px; background: linear-gradient(90deg, transparent, var(--gold-300), transparent); }
.ftr__grid { display: grid; grid-template-columns: 1.6fr 1fr 1fr 1.2fr; gap: 40px; }
.ftr__tag { margin: 18px 0 6px; font: 600 1rem var(--font-display); color: var(--ice-200); letter-spacing: .04em; }
.ftr__meta { font-size: .85rem; color: var(--text-400); }
.ftr__h { font: 700 .76rem/1 var(--font-display); letter-spacing: .2em; text-transform: uppercase; color: var(--gold-300); margin-bottom: 18px; }
ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 10px; }
ul a { color: var(--text-300); font-size: .92rem; }
ul a:hover { color: var(--ice-100); }
.ftr__bottom { margin-top: 56px; padding-top: 24px; border-top: 1px solid var(--line); display: grid; gap: 8px; font-size: .8rem; color: var(--text-400); }
.ftr__bottom p { margin: 0; }
.ftr__disclaimer { max-width: 900px; }
@media (max-width: 900px) { .ftr__grid { grid-template-columns: 1fr 1fr; } .ftr__brand { grid-column: 1 / -1; } }
@media (max-width: 520px) { .ftr__grid { grid-template-columns: 1fr; } }
</style>
