<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  title: string
}>()

const emit = defineEmits<{
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()

const text = ref('')
</script>

<template>
  <dialog open>
    <h1>
      {{ title }}
    </h1>
    <input v-model="text" type="text">
    <slot />
    <div>
      <button @click="emit('confirm')">
        Confirm
      </button>
      <button @click="emit('cancel')">
        Cancel
      </button>
    </div>
  </dialog>
</template>
