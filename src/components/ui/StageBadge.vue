<script setup>
import { computed } from 'vue'
import { STAGE_LABEL, RELEASE_LABEL } from '../../config/site.js'

const props = defineProps({ value: { type: String, required: true }, label: { type: String, default: '' } })
const LABELS = { ...STAGE_LABEL, ...RELEASE_LABEL, online: 'Online', offline: 'Offline', maintenance: 'Maintenance', unknown: 'Unknown' }
const text = computed(() => props.label || LABELS[props.value] || props.value)
</script>

<template>
  <span class="badge" :class="`badge--${value}`">{{ text }}</span>
</template>
