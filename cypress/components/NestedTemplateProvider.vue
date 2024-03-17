<script setup lang="ts">
import { defineAsyncComponent, h } from 'vue'
import { TemplateProvider, defineTemplate, useTemplate } from '../../src/index'

const { hide } = useTemplate({
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
}, {
  showByDefault: true,
})
</script>

<template>
  <TemplateProvider>
    <TemplateProvider>
      <TemplateProvider />
      <TemplateProvider />
      <TemplateProvider />
      <TemplateProvider />
    </TemplateProvider>
  </TemplateProvider>
  <TemplateProvider>
    <TemplateProvider>
      <TemplateProvider />
      <TemplateProvider />
      <TemplateProvider />
      <TemplateProvider />
    </TemplateProvider>
  </TemplateProvider>
</template>
