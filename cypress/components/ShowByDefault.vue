<script setup lang="ts">
import { h } from 'vue'
import { TemplateProvider, useTemplate } from '../../src/index'

const props = defineProps<{
  showByDefault: boolean
}>()

const text = 'Hello World!'
useTemplate({ component: () => h('div', text) }, {
  showByDefault: props.showByDefault,
})
</script>

<template>
  <TemplateProvider />
</template>
