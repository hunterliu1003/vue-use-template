<script setup lang="ts">
import { ref } from 'vue'
import { Container } from '../../src/index'
import HideOnUnmountedDialog from './HideOnUnmountedDialog.vue'

defineProps<{
  hideOnUnmounted: boolean
}>()

const showOnUnmountedDialog = ref(true)
</script>

<template>
  <div>
    <HideOnUnmountedDialog v-if="showOnUnmountedDialog" :hide-on-unmounted="hideOnUnmounted" />
    <button @click="() => showOnUnmountedDialog = false">
      Hide OnUnmountedDialog
    </button>

    <Container />
  </div>
</template>
