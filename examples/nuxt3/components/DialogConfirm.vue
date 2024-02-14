<script setup lang="ts">
defineProps<{
  title: string
}>()

const emit = defineEmits<{
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()
</script>

<template>
  <dialog open class="fixed inset-0 rounded-md p-4 space-y-4">
    <h1 class="font-bold text-xl">
      {{ title }}
    </h1>
    <slot />
    <div class="space-x-2">
      <button class="px-2 border rounded" @click="emit('confirm')">
        Confirm
      </button>
      <button class="px-2 border rounded" @click="emit('cancel')">
        Cancel
      </button>
    </div>
  </dialog>
</template>
