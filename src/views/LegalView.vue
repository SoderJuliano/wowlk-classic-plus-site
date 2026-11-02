<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { site } from '../config/site.js'

const route = useRoute()
const isTerms = computed(() => route.name === 'terms')
</script>

<template>
  <section class="legal section">
    <div class="container legal__box panel">
      <p class="eyebrow">Legal</p>
      <template v-if="isTerms">
        <h1 class="gold-text">Terms of Use</h1>
        <p class="legal__ver">Version {{ site.auth.termsVersion }} · Draft — to be reviewed before launch.</p>
        <h2>1. The project</h2>
        <p>{{ site.name }} is a free, non-commercial fan project based on {{ site.game.expansion }} {{ site.game.version }}. It is not affiliated with Blizzard Entertainment.</p>
        <h2>2. Your account</h2>
        <p>You are responsible for keeping your credentials safe. One person may hold multiple accounts only where the realm rules allow it. Accounts created by automated means may be removed.</p>
        <h2>3. Fair play</h2>
        <p>Cheating, exploiting bugs, botting, harassment and real-money trading are not allowed and may result in suspension.</p>
        <h2>4. Voluntary support</h2>
        <p>Playing is free. Any contribution is voluntary, grants no competitive advantage and is not required to play.</p>
        <h2>5. Availability</h2>
        <p>The service is provided “as is”, without guarantees of uptime, and features marked as planned or experimental may change or never ship.</p>
      </template>
      <template v-else>
        <h1 class="gold-text">Privacy Policy</h1>
        <p class="legal__ver">Version {{ site.auth.termsVersion }} · Draft — to be reviewed before launch.</p>
        <h2>What we collect</h2>
        <p>Your username, e-mail address, an SRP6 password verifier (your password itself is never transmitted or stored), the time you accepted the terms and your notification preference.</p>
        <h2>Why</h2>
        <p>To create and secure your game account, send you account notices, recover access and — if you opt in — notify you when downloads become available.</p>
        <h2>What we never do</h2>
        <p>We do not sell your data or use it for advertising.</p>
        <h2>Your rights</h2>
        <p>You may request access, correction or deletion of your data at any time through our official channels (LGPD / GDPR).</p>
      </template>
      <RouterLink to="/" class="btn btn--ghost">Back to Home</RouterLink>
    </div>
  </section>
</template>

<style scoped>
.legal { padding-top: calc(var(--header-h) + 64px); }
.legal__box { max-width: 820px; }
.legal__box h1 { font-size: clamp(2rem, 4vw, 2.6rem); }
.legal__box h2 { font-size: 1.15rem; margin-top: 28px; color: var(--gold-200); }
.legal__box p { color: var(--text-300); }
.legal__ver { font-size: .85rem; color: var(--text-400) !important; }
.legal__box .btn { margin-top: 24px; }
</style>
