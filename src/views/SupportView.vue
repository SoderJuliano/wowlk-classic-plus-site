<script setup>
import PageBanner from '../components/ui/PageBanner.vue'
import SupportSection from '../components/home/SupportSection.vue'
import bg from '../assets/bg/download.webp'
</script>

<template>
  <PageBanner
    :image="bg" position="50% 30%" eyebrow="No Pay to Win"
    title="Free for Everyone."
    subtitle="Support keeps the realm running — it never buys power."
  />
  <SupportSection />
</template>
