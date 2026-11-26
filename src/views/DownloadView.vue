<script setup>
import PageBanner from '../components/ui/PageBanner.vue'
import ServerStatus from '../components/home/ServerStatus.vue'
import PlayNowSection from '../components/home/PlayNowSection.vue'
import DownloadsSection from '../components/home/DownloadsSection.vue'
import LauncherSection from '../components/home/LauncherSection.vue'
import bg from '../assets/bg/download.webp'
</script>

<template>
  <PageBanner
    :image="bg" position="50% 30%" eyebrow="Free to play"
    title="Download & Play"
    subtitle="Create your account, install the launcher and step into Northrend."
    overlap
  />
  <ServerStatus />
  <PlayNowSection />
  <DownloadsSection />
  <LauncherSection />
</template>
