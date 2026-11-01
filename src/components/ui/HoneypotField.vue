<script setup>
/**
 * Anti-bot honeypot. Off-screen (not display:none), out of the tab order and the
 * accessibility tree, autocomplete off. Humans never fill it; naive bots do.
 */
const model = defineModel({ type: String, default: '' })
</script>

<template>
  <div class="hp-field" aria-hidden="true">
    <label for="website">Website</label>
    <input id="website" v-model="model" type="text" name="website" tabindex="-1" autocomplete="off" />
  </div>
</template>
