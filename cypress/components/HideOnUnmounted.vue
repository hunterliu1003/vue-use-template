<script setup lang="ts">
import { ref } from 'vue'

import { TemplateProvider } from '../../src/index'
import HideOnUnmountedDialog from './HideOnUnmountedDialog.vue'

defineProps<{
  hideOnUnmounted: boolean
}>()

const showOnUnmountedDialog = ref(true)
</script>

<template>
  <TemplateProvider>
    <HideOnUnmountedDialog v-if="showOnUnmountedDialog" :hide-on-unmounted="hideOnUnmounted" />
    <button @click="() => showOnUnmountedDialog = false">
      Hide OnUnmountedDialog
    </button>
  </TemplateProvider>
</template>
