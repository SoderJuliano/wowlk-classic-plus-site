<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PageBanner from '../components/ui/PageBanner.vue'
import Client64Section from '../components/home/Client64Section.vue'
import Client64DonateModal from '../components/client64/Client64DonateModal.vue'
import Client64Changelog from '../components/client64/Client64Changelog.vue'
import AppIcon from '../components/ui/AppIcon.vue'
import bg from '../assets/bg/client64.webp'
import { CLIENT64_COMMITS, CLIENT64_CHANGELOG_DATE } from '../data/client64Commits.js'
import { detectRegion, client64Supporter, refreshClient64Supporter, getClient64DonationConfig } from '../services/donationService.js'
import { session } from '../services/session.js'

const route = useRoute()
const router = useRouter()
const isPt = computed(() => detectRegion() === 'BR')
const donateOpen = ref(false)

// The price always comes from the server (the same value the payment charges).
const price = ref(99.9)
const priceUsd = ref(16.82)
getClient64DonationConfig().then((c) => {
  if (c?.fixedAmount != null) price.value = Number(c.fixedAmount)
  if (c?.usdEquivalent != null) priceUsd.value = Number(c.usdEquivalent)
}).catch(() => {})
const brl = computed(() => `R$ ${price.value.toFixed(2).replace('.', ',')}`)
const brlEn = computed(() => `R$ ${price.value.toFixed(2)}`)
const usdText = computed(() => `≈ US$ ${priceUsd.value.toFixed(2)}`)

function openDonate() {
  donateOpen.value = true
}
function closeDonate() {
  donateOpen.value = false
  if (route.query.donate) {
    const q = { ...route.query }
    delete q.donate
    router.replace({ query: q })
  }
}

onMounted(() => {
  if (route.query.donate === '1') donateOpen.value = true
  if (session.value) refreshClient64Supporter()
})
watch(() => session.value?.username, () => {
  if (session.value) refreshClient64Supporter({ force: true })
})
</script>

<template>
  <PageBanner
    :image="bg" position="65% 40%"
    :eyebrow="isPt ? 'Acesso antecipado · Em desenvolvimento' : 'Early access · In development'"
    :title="isPt ? 'O Cliente Nativo 64-bit' : 'The Native 64-bit Client'"
    :subtitle="isPt ? 'Uma nova geração do cliente Wrath of the Lich King para Windows e Linux.' : 'A new generation of the Wrath client for Windows and Linux.'"
  />

  <!-- Voluntary contribution suggestion ("Me pague uma pizza :D" — R$ 99,90) -->
  <section class="section pizza-sec" aria-labelledby="pizza-title">
    <div class="container">
      <div class="pizza panel panel--frost">
        <div class="pizza__copy">
          <p class="eyebrow">{{ isPt ? 'Sugestão de apoio voluntário' : 'Voluntary support suggestion' }}</p>
          <h2 id="pizza-title" class="gold-text">{{ isPt ? 'Me pague uma pizza :D' : 'Buy me a pizza :D' }}</h2>
          <p>
            {{ isPt
              ? `Gostou do avanço do Cliente 64-bit? Se quiser contribuir com o projeto, toda doação de ${brl} é convertida em tokens para melhorar e acelerar o desenvolvimento.`
              : `Excited about the 64-bit Client? If you would like to contribute, every ${brlEn} donation is converted into tokens to improve and accelerate development.` }}
          </p>
          <p class="pizza__note">
            <AppIcon name="info" :size="16" />
            <span>
              {{ isPt
                ? 'Contribuição totalmente opcional. Pedimos login ou cadastro antes do pagamento para registrarmos o seu interesse — assim sabemos quem é o player e avisamos quando novos recursos chegarem pelo launcher.'
                : 'Completely optional contribution. We ask you to log in or sign up before payment so we can register your interest — we need to know who you are to notify you when new features arrive in the launcher.' }}
            </span>
          </p>
          <p v-if="client64Supporter?.supporter" class="pizza__done">
            <AppIcon name="check" :size="16" />
            <span>{{ isPt ? 'Você já contribuiu para o Cliente 64-bit — muito obrigado!' : 'You already contributed to the 64-bit Client — thank you!' }}</span>
          </p>
        </div>

        <div class="pizza__cta">
          <div class="pizza__price">
            <span class="pizza__price-tag">{{ isPt ? 'Contribuição fixa' : 'Fixed contribution' }}</span>
            <strong class="gold-text">{{ isPt ? brl : usdText }}</strong>
            <small>{{ isPt ? 'Pix no Brasil · Cartão fora do Brasil' : `${brlEn} via Mercado Pago · Card / Pix` }}</small>
          </div>
          <button type="button" class="btn btn--gold btn--lg pizza__btn" @click="openDonate">
            <AppIcon name="heart" :size="18" />
            {{ isPt ? `Me pague uma pizza · ${brl}` : `Buy me a pizza · ${brlEn}` }}
          </button>
          <a href="#client64-changelog" class="pizza__log-link">
            {{ isPt
              ? `Ver as ${CLIENT64_COMMITS.length} features e fixes já feitos (até ${CLIENT64_CHANGELOG_DATE.split('-').reverse().join('/')})`
              : `See all ${CLIENT64_COMMITS.length} features & fixes delivered (as of ${CLIENT64_CHANGELOG_DATE})` }}
          </a>
        </div>
      </div>
    </div>
  </section>

  <Client64Section />

  <Client64Changelog :is-pt="isPt" />

  <Client64DonateModal :open="donateOpen" @close="closeDonate" />
</template>

<style scoped>
.pizza-sec { padding-bottom: 0; }
.pizza {
  display: grid; grid-template-columns: 1.35fr auto; gap: clamp(20px, 4vw, 44px); align-items: center;
  background: linear-gradient(135deg, rgba(16, 40, 66, .88), rgba(8, 16, 28, .94));
  border-color: rgba(233, 196, 106, .35);
  box-shadow: 0 24px 64px -24px rgba(0, 0, 0, .85), 0 0 50px -24px rgba(233, 196, 106, .35);
}
.pizza__copy { display: grid; gap: 12px; }
.pizza__copy h2 { margin: 0; font-size: clamp(1.6rem, 2.8vw, 2.2rem); }
.pizza__copy p { margin: 0; color: var(--text-200); font-size: .98rem; line-height: 1.6; }
.pizza__note {
  display: flex; align-items: flex-start; gap: 10px; padding: 12px 14px; border-radius: var(--radius-sm);
  background: rgba(79, 179, 247, .08); border: 1px solid var(--line);
  font-size: .86rem !important; color: var(--ice-100) !important;
}
.pizza__note svg { flex: none; margin-top: 2px; color: var(--ice-300); }
.pizza__done {
  display: inline-flex; align-items: center; gap: 8px; color: var(--ok) !important; font-weight: 600; font-size: .9rem !important;
}
.pizza__cta { display: grid; gap: 12px; justify-items: center; min-width: 270px; text-align: center; }
.pizza__price { display: grid; gap: 2px; }
.pizza__price-tag { font-size: .72rem; letter-spacing: .16em; text-transform: uppercase; color: var(--text-400); }
.pizza__price strong { font: 800 2.1rem/1.05 var(--font-display); }
.pizza__price small { font-size: .78rem; color: var(--text-300); }
.pizza__btn { width: 100%; justify-content: center; }
.pizza__log-link { font-size: .82rem; color: var(--ice-300); text-decoration: underline; }
.pizza__log-link:hover { color: var(--ice-100); }
@media (max-width: 860px) {
  .pizza { grid-template-columns: 1fr; }
  .pizza__cta { width: 100%; min-width: 0; }
}
</style>
