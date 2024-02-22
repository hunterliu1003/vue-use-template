<script setup lang="ts">
import { h } from 'vue'
import { useTemplate } from '../../src/index'

const props = defineProps<{
  hideOnUnmounted: boolean
}>()

const text = 'Hello World!'
const { show } = useTemplate({ component: () => h('div', text) }, {
  hideOnUnmounted: props.hideOnUnmounted,
})
</script>

<template>
  <button @click="() => show()">
    Open Modal
  </button>
</template>
