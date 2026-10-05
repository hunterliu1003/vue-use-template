# vue-use-template

## Playground

- [Stackblitz for Vue 3](https://stackblitz.com/github/hunterliu1003/vue-use-template/tree/master/examples/vue3)
- [Stackblitz for Nuxt](https://stackblitz.com/github/hunterliu1003/vue-use-template/tree/master/examples/nuxt)

## App.vue

```vue
<script setup lang="ts">
import { TemplateProvider, useTemplate } from 'vue-use-template'

// Support Ref, Reactive, Computed
const props = reactive({
  title: 'Hello World!'
})

const { show, hide } = useTemplate({
  component: defineAsyncComponent(() => import('./DialogConfirm.vue')),
  props,
  emits: {
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
  <TemplateProvider>
    <div>App</div>
    <!-- or -->
    <RouterView />
    <!-- or -->
    <NuxtPage />
  </TemplateProvider>
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

## SSR

Templates shown while components set up (`showByDefault: true`, or `show()` called synchronously in `setup`) are rendered into the server HTML and hydrated on the client without mismatches. Every server render keeps its own templates, so nothing leaks between requests.

Templates shown after an `await` in an async `setup`, or by a component that renders after `<TemplateProvider>` (instead of inside or around it), are rendered on the client only.

On the server, `show()` called outside a component (e.g. in a server plugin) is ignored.
