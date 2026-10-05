import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/index.ts', 'src/server.ts'],
  format: ['esm', 'cjs'],
  platform: 'neutral',
  deps: {
    neverBundle: [/^node:/],
  },
  fixedExtension: true,
  dts: true,
})
