<script setup>
import { ref, computed, useId } from 'vue'
import AppIcon from '../ui/AppIcon.vue'

const model = defineModel({ type: String, default: '' })
const props = defineProps({
  label: { type: String, required: true },
  type: { type: String, default: 'text' },
  error: { type: String, default: '' },
  hint: { type: String, default: '' },
  autocomplete: { type: String, default: 'off' },
  maxlength: { type: Number, default: undefined },
  placeholder: { type: String, default: '' },
  valid: { type: Boolean, default: false },
  name: { type: String, default: undefined }
})
const emit = defineEmits(['blur'])
const id = useId()
const reveal = ref(false)
const isPassword = computed(() => props.type === 'password')
const inputType = computed(() => (isPassword.value && reveal.value ? 'text' : props.type))
const describedBy = computed(() => [props.error && `${id}-err`, props.hint && `${id}-hint`].filter(Boolean).join(' ') || undefined)
</script>

<template>
  <div class="field">
    <label :for="id">{{ label }}</label>
    <div class="tf">
      <input
        :id="id" v-model="model" class="input" :class="{ 'is-valid': valid && !error, 'tf__pw': isPassword }"
        :type="inputType" :name="name" :autocomplete="autocomplete" :maxlength="maxlength" :placeholder="placeholder"
        :aria-invalid="error ? 'true' : 'false'" :aria-describedby="describedBy"
        autocapitalize="off" spellcheck="false" @blur="emit('blur')"
      />
      <button
        v-if="isPassword" type="button" class="tf__eye" :aria-label="reveal ? 'Hide password' : 'Show password'"
        :aria-pressed="reveal" @click="reveal = !reveal"
      >
        <AppIcon :name="reveal ? 'eye' : 'lock'" :size="18" />
      </button>
    </div>
    <p v-if="error" :id="`${id}-err`" class="field-error" role="alert">{{ error }}</p>
    <p v-else-if="hint" :id="`${id}-hint`" class="field-hint">{{ hint }}</p>
    <slot />
  </div>
</template>

<style scoped>
.tf { position: relative; }
.tf__pw { padding-right: 46px; }
.tf__eye { position: absolute; right: 6px; top: 50%; transform: translateY(-50%); background: none; border: 0; color: var(--text-400); padding: 8px; cursor: pointer; border-radius: 4px; }
.tf__eye:hover { color: var(--ice-200); }
.field p { margin: 0; }
</style>
