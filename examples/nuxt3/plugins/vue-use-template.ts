import { createTemplatePlugin } from 'vue-use-template'
import { defineNuxtPlugin } from '#imports'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(createTemplatePlugin())
})
