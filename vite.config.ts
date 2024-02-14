/* eslint-env node */

import path from 'node:path'
import process from 'node:process'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

const name = 'index'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    dts({
      include: 'src',
    }),
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name,
      fileName: format => `${name}.${format === 'es' ? 'm' : 'c'}js`,
    },
    rollupOptions: {
      external: [
        'vue',
        '@vueuse/core',
      ],
      output: {
        globals: {
          'vue': 'Vue',
          '@vueuse/core': 'VueUse',
        },
      },
    },
  },
  define: {
    __DEV__: JSON.stringify(process.env.prod),
  },
})
