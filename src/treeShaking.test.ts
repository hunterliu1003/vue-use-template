import type { Rollup } from 'vite'
import { fileURLToPath } from 'node:url'
import { build } from 'vite'
import { describe, expect, it, onTestFinished, vi } from 'vitest'

const entry = fileURLToPath(new URL('./index.ts', import.meta.url))

async function bundle(imports: string[], external = ['vue', '@vueuse/core']) {
  /** Vite inlines NODE_ENV, which Vitest sets to `test`; a consumer's production build sees `production`. */
  vi.stubEnv('NODE_ENV', 'production')
  onTestFinished(() => {
    vi.unstubAllEnvs()
  })
  const result = await build({
    configFile: false,
    logLevel: 'silent',
    build: {
      write: false,
      minify: true,
      rollupOptions: {
        input: 'virtual:consumer',
        external,
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

  it('drops the development warning from production bundles', async () => {
    /** Vue's production warn() does nothing, which the bundler can only see when Vue is bundled too. */
    expect(await bundle(['useTemplate'], [])).not.toContain('show() is ignored')
  })

  it('does not import @vueuse/core', async () => {
    expect(await bundle(['TemplateProvider', 'useTemplate', 'createTemplateProvider'])).not.toContain('@vueuse/core')
  })
})
