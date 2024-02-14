# vue-use-template

## App.vue

```vue
<script setup lang="ts">
import { Container, defineTemplate, useTemplate } from 'vue-use-template'

const { show, hide } = useTemplate({
  component: defineAsyncComponent(() => import('./DialogConfirm.vue')),
  attrs: {
    title: 'Hello World!',
    onConfirm: () => {
      alert('Confirm!')
      hide()
    },
    onCancel: () => hide(),
  },
  slots: {
    default: defineTemplate({
      component: () => h('p', 'This is a dialog content.'),
    }),
  },
})
</script>

<template>
  <Container />
</template>
```

## DialogConfirm.vue

```vue
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
  <dialog open>
    <h1>{{ title }}</h1>
    <slot />
    <button @click="emit('confirm')">
      Confirm
    </button>
    <button @click="emit('cancel')">
      Cancel
    </button>
  </dialog>
</template>
```
