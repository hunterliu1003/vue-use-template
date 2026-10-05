# vue-use-template

## Playground

- [Stackblitz for Vue 3](https://stackblitz.com/github/hunterliu1003/vue-use-template/tree/master/examples/vue3)
- [Stackblitz for Nuxt](https://stackblitz.com/github/hunterliu1003/vue-use-template/tree/master/examples/nuxt)

## Install

```sh
pnpm add vue-use-template
```

`vue` and `vue-component-type-helpers` are peer dependencies. `vue-component-type-helpers` is only used for types.

## Usage

Render `TemplateProvider` once, around the rest of the app; it usually wraps `<RouterView />` or `<NuxtPage />`. It renders the templates shown with `useTemplate()` after its own content.

### App.vue

<!-- source: cypress/components/App.vue -->
```vue
<script setup lang="ts">
import { defineAsyncComponent, h, reactive, ref } from 'vue'
import { defineTemplate, TemplateProvider, useTemplate } from 'vue-use-template'

const confirmed = ref(false)
const props = reactive({
  title: 'Hello World!',
})

const { show, hide } = useTemplate({
  component: defineAsyncComponent(() => import('./DialogConfirm.vue')),
  props,
  emits: {
    onConfirm: () => {
      confirmed.value = true
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
    <button @click="show()">
      Open dialog
    </button>
    <p v-if="confirmed">
      Confirmed!
    </p>
  </TemplateProvider>
</template>
```

`DialogConfirm` is an async component, so it loads the first time it is shown. `props` is reactive, so changing `props.title` updates the open dialog.

### DialogConfirm.vue

<!-- source: cypress/components/DialogConfirm.vue -->
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

## API

### `TemplateProvider`

A component that renders its default slot, then every shown template in the order they were shown. Every `TemplateProvider` renders all templates shown with `useTemplate()`, so render it once.

### `useTemplate(template, options?)`

Returns `{ show, hide }`: `show()` renders `template` in `TemplateProvider` and `hide()` removes it. Calling `show()` while the template is shown does nothing.

`template` is a [`Template`](#template), given as a plain object, a `ref`, a `reactive` object, a `computed` or a getter. A shown template re-renders when reactive state it reads changes. When `template` is a `ref` or a `reactive` object, wrap its component in `markRaw()`; otherwise Vue makes the component reactive and warns.

`options`:

- `showByDefault` (default `false`): show the template right away.
- `hideOnUnmounted` (default `true`): hide the template when the component that called `useTemplate()` unmounts.

Call `useTemplate()` in `setup()` or `<script setup>`, or on the client outside any component, for example in a store (`hideOnUnmounted` then has no effect). On the server, call it in `setup()` (see [SSR](#ssr)).

### `createTemplateProvider()`

Returns a new `{ TemplateProvider, useTemplate }` pair with its own set of shown templates: its `TemplateProvider` renders only the templates shown with its `useTemplate()`. The `TemplateProvider` and `useTemplate` exported by the package are such a pair. Create one to render a group of templates in another place, to keep a library's templates apart from the app's, or to start each test with nothing shown.

```ts
import { createTemplateProvider } from 'vue-use-template'

export const { TemplateProvider: ToastProvider, useTemplate: useToast } = createTemplateProvider()
```

### `Template`

The object that describes what to render:

- `component`: the component, for example an SFC, an async component or a functional component.
- `props`: its props, without `on*` listeners.
- `emits`: its event listeners, keyed `on` plus the capitalized event name: `onConfirm` listens to `emit('confirm')`.
- `attrs`: props, listeners, `class` and `style` in one object.
- `slots`: the content of each slot, by slot name. Slot content is one of:
  - a string, rendered as raw HTML inside a `<div>` (see [String slots](#string-slots))
  - a component, rendered without props
  - a nested `Template`, which can have slots of its own

`attrs`, `props` and `emits` can each be a plain object, a `reactive` object, a `ref`, a `computed` or a getter. They are merged in that order: `props` override `attrs`, and `emits` override both. Slot props are not passed to slot content.

### `defineTemplate(template)`

Returns `template` unchanged. It infers the component type from `component`, so `attrs`, `props` and `emits` are type-checked against that component. Use it for nested templates in `slots`, which are not type-checked otherwise, or to get the same checks on a template declared on its own.

### `templateToVNodeFn(template)`

Returns a function that creates a VNode from the template's current values each time it is called; `TemplateProvider` renders shown templates this way. `template` takes the same forms as in `useTemplate()`. Use it to render a template yourself, for example in a render function.

### `mergeTemplateAttrs(template)`

Resolves `attrs`, `props` and `emits` (refs, computeds and getters included) and merges them into a new object, in that order. This is how `templateToVNodeFn()` builds the component's props. `template` takes the same forms as in `useTemplate()`.

### `isTemplate(value)`

A type guard for `Template`: `true` for an object with a `component` key, also when it is wrapped in a `ref`, a `computed` or a `reactive` object. It never calls a function, so a getter or a functional component returns `false`.

### Types

- `Template<T>`: a template for component `T` (see [`Template`](#template)).
- `UseTemplate`: the type of `useTemplate()`, including the one `createTemplateProvider()` returns.
- `Provider`: `{ vNodeFns: Set<() => VNode> }`, the state a `TemplateProvider` renders, with one VNode function per shown template. No other export takes or returns it.

## String slots

A string slot is rendered as raw HTML inside a `<div>`, the same as [`v-html`](https://vuejs.org/api/built-in-directives.html#v-html). Rendering arbitrary HTML can easily lead to XSS attacks, so only use string slots for trusted content and never for user-provided content. To render untrusted text, pass a component instead:

```ts
useTemplate({
  component: DialogConfirm,
  slots: {
    default: () => h('p', userProvidedText),
  },
})
```

## SSR

Templates shown while components set up (`showByDefault: true`, or `show()` called synchronously in `setup`) are rendered into the server HTML and hydrated on the client without mismatches. Every server render keeps its own templates, so nothing leaks between requests.

Templates shown after an `await` in an async `setup`, or by a component that renders after `<TemplateProvider>` (instead of inside or around it), are rendered on the client only.

On the server, `show()` from a `useTemplate()` called outside a component (for example in a server plugin) is ignored and, outside production, logs a warning.
