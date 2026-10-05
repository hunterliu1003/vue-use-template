import { fileURLToPath } from 'node:url'
import type { Rollup } from 'vite'
import { build } from 'vite'
import { describe, expect, it } from 'vitest'

const entry = fileURLToPath(new URL('./index.ts', import.meta.url))

async function bundle(imports: string[]) {
  const result = await build({
    configFile: false,
    logLevel: 'silent',
    build: {
      write: false,
      minify: true,
      rollupOptions: {
        input: 'virtual:consumer',
        external: ['vue', '@vueuse/core'],
      },
    },
    plugins: [{
      name: 'consumer',
      resolveId: id => (id === 'virtual:consumer' ? '\0consumer' : null),
      load: id => (id === '\0consumer'
        ? `import { ${imports.join(', ')} } from ${JSON.stringify(entry)}\nconsole.log(${imports.join(', ')})`
        : null),
    }],
  }) as Rollup.RollupOutput
  return result.output[0].code
}

describe('tree shaking', () => {
  it('drops the default provider when only the template helpers are imported', async () => {
    expect(await bundle(['templateToVNodeFn', 'defineTemplate'])).not.toContain('"TemplateProvider"')
  })

  it('keeps the default provider when it is imported', async () => {
    expect(await bundle(['TemplateProvider', 'useTemplate'])).toContain('"TemplateProvider"')
  })
})
