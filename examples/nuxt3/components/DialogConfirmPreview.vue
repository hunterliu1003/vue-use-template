<script setup lang="ts">
import { defineAsyncComponent, h } from 'vue'
import { defineTemplate, useTemplate } from 'vue-use-template'

const { show, hide } = useTemplate({
  component: defineAsyncComponent(() => import('./DialogConfirm.vue')),
  attrs: {
    title: 'Hello World!',
    onConfirm: () => {
      hide()
    },
    onCancel: () => {
      hide()
    },
  },
  slots: {
    default: defineTemplate({
      component: () => h('p', 'This is a dialog content.'),
    }),
  },
})
show()
</script>

<template>
  <VButton @click="() => show()">
    Open Modal
  </VButton>
</template>
