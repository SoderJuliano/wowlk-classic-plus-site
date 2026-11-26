<script setup>
import PageBanner from '../components/ui/PageBanner.vue'
import AboutSection from '../components/home/AboutSection.vue'
import FeaturesSection from '../components/home/FeaturesSection.vue'
import ElitesSection from '../components/home/ElitesSection.vue'
import VisualsSection from '../components/home/VisualsSection.vue'
import bg from '../assets/bg/features.webp'
</script>

<template>
  <PageBanner
    :image="bg" position="70% 35%" eyebrow="The game"
    title="Classic at Heart. Plus by Design."
    subtitle="Wrath of the Lich King as you remember it — refined where it matters."
  />
  <ElitesSection />
  <FeaturesSection />
  <VisualsSection />
  <AboutSection />
</template>
