import type { Plugin } from 'vue'
import { pinia } from './pinia'

export const plugin: Plugin = {
  install(app) {
    app.use(pinia)
  },
}
