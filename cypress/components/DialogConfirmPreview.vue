<script setup lang="ts">
import { defineAsyncComponent, h } from 'vue'
import { Container, defineTemplate, useTemplate } from '../../src/index'

const { show, hide } = useTemplate({
  component: defineAsyncComponent(() => import('./DialogConfirm.vue')),
  attrs: {
    title: 'Hello World!',
    onConfirm: () => hide(),
    onCancel: () => hide(),
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
  <div>
    <button @click="() => show()">
      Open Modal
    </button>

    <Container />
  </div>
</template>
