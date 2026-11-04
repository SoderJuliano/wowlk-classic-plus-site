<script setup>
/**
 * Inline SVG icon set. Brand marks (Apple, Linux) come from simple-icons (CC0)
 * and are inlined at build time; everything else is drawn for this project.
 */
import { computed } from 'vue'
import { siApple, siLinux } from 'simple-icons'

const props = defineProps({
  name: { type: String, required: true },
  size: { type: [Number, String], default: 24 },
  label: { type: String, default: '' }
})

// Filled brand glyphs (viewBox 0 0 24 24)
const BRAND = {
  apple: siApple.path,
  linux: siLinux.path,
  windows: 'M0 3.45 9.75 2.1v9.42H0zm10.95-1.5L24 0v11.4H10.95zM0 12.6h9.75v9.45L0 20.7zm10.95.12H24V24l-13.05-1.8z'
}

// Stroke icons (viewBox 0 0 24 24, stroke = currentColor)
const STROKE = {
  sword: '<path d="M14.5 17.5 3 6V3h3l11.5 11.5"/><path d="m13 19 6-6"/><path d="m16 16 4 4"/><path d="m19 21 2-2"/>',
  swords: '<path d="M14.5 17.5 3 6V3h3l11.5 11.5"/><path d="m13 19 6-6M16 16l4 4M19 21l2-2"/><path d="M14.5 6.5 18 3h3v3l-3.5 3.5"/><path d="m5 14 4 4M7 17l-3 3M3 19l2 2"/>',
  bag: '<path d="M6 8h12l-1 12H7z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/><path d="M10 13h4"/>',
  chest: '<rect x="3" y="9" width="18" height="11" rx="1.5"/><path d="M3 13h18"/><path d="M5 9a7 5 0 0 1 14 0"/><rect x="10.5" y="11.5" width="3" height="4" rx=".6"/>',
  hammer: '<path d="m15 12-8.5 8.5a2.1 2.1 0 0 1-3-3L12 9"/><path d="M17.6 15 22 10.6l-6.4-6.4c-1.7-1.7-4.4-1.7-6 0L8.7 5.1 15 11.4z"/>',
  hourglass: '<path d="M6 2h12M6 22h12"/><path d="M7 2c0 5 5 6 5 10s-5 5-5 10M17 2c0 5-5 6-5 10s5 5 5 10"/><path d="M9 18.5h6"/>',
  shield: '<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/><path d="m9 12 2 2 4-4"/>',
  chip: '<rect x="6" y="6" width="12" height="12" rx="1.5"/><rect x="9.5" y="9.5" width="5" height="5" rx=".5"/><path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3"/>',
  memory: '<rect x="2" y="7" width="20" height="10" rx="1.5"/><path d="M6 11v2M10 11v2M14 11v2M18 11v2M5 17v3M9 17v3M15 17v3M19 17v3"/>',
  gauge: '<path d="M12 14 16 9"/><path d="M3.3 17a9 9 0 1 1 17.4 0"/><circle cx="12" cy="14" r="1.6"/>',
  bolt: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
  sparkles: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4"/><path d="m12 7 1.5 3.5L17 12l-3.5 1.5L12 17l-1.5-3.5L7 12l3.5-1.5z"/>',
  unlock: '<rect x="4" y="11" width="16" height="10" rx="1.5"/><path d="M8 11V7a4 4 0 0 1 7.5-2"/><path d="M12 15v2"/>',
  layers: '<path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/><path d="m3 17.5 9 5 9-5" opacity=".55"/>',
  upscale: '<path d="M4 14v6h6"/><path d="M4 20 11 13"/><path d="M14 4h6v6"/><path d="M20 4 13 11"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  download: '<path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 20h14"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="1.5"/><path d="m3.5 6 8.5 7 8.5-7"/>',
  lock: '<rect x="4" y="11" width="16" height="10" rx="1.5"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/><path d="M12 15v2"/>',
  refresh: '<path d="M20 11a8 8 0 0 0-14.3-4.9L4 8"/><path d="M4 4v4h4"/><path d="M4 13a8 8 0 0 0 14.3 4.9L20 16"/><path d="M20 20v-4h-4"/>',
  heart: '<path d="M12 20s-7.5-4.6-9.2-9.2C1.6 7.5 3.7 4.5 7 4.5c2 0 3.5 1.1 5 3 1.5-1.9 3-3 5-3 3.3 0 5.4 3 4.2 6.3C19.5 15.4 12 20 12 20z"/>',
  crown: '<path d="m3 8 4.5 4L12 5l4.5 7L21 8l-2 11H5z"/><path d="M5 19h14"/>',
  gift: '<rect x="3" y="8" width="18" height="5" rx="1"/><path d="M5 13v8h14v-8M12 8v13"/><path d="M12 8C10 4 6.5 4.5 7 7c.3 1 2 1 5 1zM12 8c2-4 5.5-3.5 5-1-.3 1-2 1-5 1z"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="1.5"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  palette: '<path d="M12 3a9 9 0 1 0 0 18c1.4 0 2-1 2-2 0-1.5-1.3-1.8-1.3-3 0-1 .8-1.8 2-1.8H17a4 4 0 0 0 4-4C21 6 17 3 12 3z"/><circle cx="7.5" cy="11" r="1"/><circle cx="10" cy="7" r="1"/><circle cx="15" cy="7" r="1"/>',
  monitor: '<rect x="2" y="4" width="20" height="13" rx="1.5"/><path d="M8 21h8M12 17v4"/>',
  folder: '<path d="M3 6.5A1.5 1.5 0 0 1 4.5 5H9l2 2.5h8.5A1.5 1.5 0 0 1 21 9v9.5a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18.5z"/>',
  fileCheck: '<path d="M14 3H6.5A1.5 1.5 0 0 0 5 4.5v15A1.5 1.5 0 0 0 6.5 21h11a1.5 1.5 0 0 0 1.5-1.5V8z"/><path d="M14 3v5h5"/><path d="m9 14.5 2 2 4-4"/>',
  switch: '<path d="M7 4 3 8l4 4"/><path d="M3 8h13"/><path d="m17 20 4-4-4-4"/><path d="M21 16H8"/>',
  cloud: '<path d="M7 18a5 5 0 1 1 1.2-9.9A6 6 0 0 1 19.6 10 4 4 0 0 1 18 18z"/><path d="M12 11v6M9.5 14.5 12 17l2.5-2.5"/>',
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14a6.5 6.5 0 0 1 3.5 6"/>',
  paw: '<circle cx="12" cy="14.5" r="3.5"/><circle cx="6.5" cy="10.5" r="1.5"/><circle cx="10" cy="7.5" r="1.5"/><circle cx="14" cy="7.5" r="1.5"/><circle cx="17.5" cy="10.5" r="1.5"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.5 3.8 5.5 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.5-3.8-9S9.5 5.5 12 3z"/>',
  arrowRight: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  snowflake: '<path d="M12 2v20M3.3 7l17.4 10M20.7 7 3.3 17"/><path d="m9 4 3 2 3-2M9 20l3-2 3 2M4 10.5l3.4-.2L8.9 7.2M19.9 13.5l-3.4.2-1.5 3.1M4 13.5l3.4.2 1.5 3.1M19.9 10.5l-3.4-.2-1.5-3.1"/>',
  rune: '<path d="M12 2 20 12 12 22 4 12z"/><path d="M12 7v10M9 10l3 2 3-2"/>'
}

const isBrand = computed(() => props.name in BRAND)
const markup = computed(() => STROKE[props.name] ?? '')
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    :role="label ? 'img' : undefined"
    :aria-label="label || undefined"
    :aria-hidden="label ? undefined : 'true'"
    focusable="false"
    :fill="isBrand ? 'currentColor' : 'none'"
    :stroke="isBrand ? 'none' : 'currentColor'"
    stroke-width="1.6"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path v-if="isBrand" :d="BRAND[name]" />
    <g v-else v-html="markup" />
  </svg>
</template>
