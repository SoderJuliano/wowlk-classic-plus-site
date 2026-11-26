<script setup>
import bg from '../../assets/bg/support.webp'
</script>

<template>
  <section class="join" aria-labelledby="join-title">
    <img :src="bg" alt="" class="join__img" loading="lazy" decoding="async" />
    <div class="join__shade" aria-hidden="true" />
    <div v-reveal class="container join__content">
      <h2 id="join-title" class="join__title">Northrend Awaits.</h2>
      <p class="join__text">Free account. No Pay to Win. One launcher keeps everything up to date.</p>
      <RouterLink :to="{ name: 'register' }" class="btn btn--gold btn--lg">Create Free Account</RouterLink>
      <p class="join__login">Already playing? <RouterLink :to="{ name: 'login' }">Log in</RouterLink></p>
    </div>
  </section>
</template>

<style scoped>
.join {
  position: relative; isolation: isolate; overflow: hidden;
  padding: clamp(96px, 14vw, 180px) 0; text-align: center;
}
.join__img { position: absolute; inset: 0; z-index: -2; width: 100%; height: 100%; max-width: none; object-fit: cover; object-position: 65% 30%; }
.join__shade {
  position: absolute; inset: 0; z-index: -1;
  background:
    radial-gradient(ellipse 60% 70% at 50% 50%, rgba(3, 6, 10, .55), rgba(3, 6, 10, .85)),
    linear-gradient(180deg, var(--bg-900) 0%, transparent 25%, transparent 75%, var(--bg-900) 100%);
}
.join__content { display: grid; justify-items: center; }
.join__title {
  margin: 0; font: 900 clamp(2rem, 5.5vw, 3.8rem)/1 var(--font-deco);
  color: var(--ice-50); text-shadow: 0 3px 0 rgba(0, 0, 0, .55), 0 0 28px rgba(95, 190, 255, .35);}
.join__text { margin: 18px 0 30px; font-size: 1.1rem; color: var(--text-200); }
.join__login { margin: 18px 0 0; font-size: .9rem; color: var(--text-300); }
</style>
