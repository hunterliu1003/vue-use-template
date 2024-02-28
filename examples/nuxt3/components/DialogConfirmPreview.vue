<script setup lang="ts">
import { defineAsyncComponent, h, reactive } from 'vue'
import { defineTemplate, useTemplate } from 'vue-use-template'

const props = reactive({
  title: 'Hello World!',
})

const { show, hide } = useTemplate({
  component: defineAsyncComponent(() => import('./DialogConfirm.vue')),
  props,
  emits: {
    onConfirm: () => {
      props.title = 'Confirmed!'
      setTimeout(() => hide(), 1000)
    },
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
  <button @click="() => show()">
    Open Modal
  </button>
</template>
