import type { InjectionKey } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import { createSSRApp, defineComponent, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { createInstanceResolver } from './createInstanceResolver'
import { TemplateProvider, useTemplate } from './index'
import { runWithApp } from './server'

const tick = () => new Promise(resolve => setTimeout(resolve))

describe('on the server', () => {
  it('never falls back to the active instance outside setup', () => {
    const resolver = createInstanceResolver(Symbol('thing') as InjectionKey<string>)
    resolver.setActive('active')

    expect(resolver.resolve()).toBeUndefined()
  })

  it('resolves the instance of its own request after await inside runWithApp()', async () => {
    const key: InjectionKey<string> = Symbol('thing')
    const resolver = createInstanceResolver(key)
    function request(name: string) {
      const app = createSSRApp({ render: () => h('p') })
      app.provide(key, name)
      resolver.setActive(name)
      return runWithApp(app, async () => {
        await tick()
        return resolver.resolve()
      })
    }

    expect(await Promise.all([request('first'), request('second')])).toEqual(['first', 'second'])
  })

  it('renders a template shown outside setup into its own request inside runWithApp()', async () => {
    function request(text: string) {
      const App = defineComponent({
        async setup() {
          await tick()
          useTemplate({ component: () => h('dialog', text) }).show()
          return () => h(TemplateProvider, null, { default: () => h('p', 'page') })
        },
      })
      const app = createSSRApp(App)
      return runWithApp(app, () => renderToString(app))
    }

    const [first, second] = await Promise.all([request('first request'), request('second request')])

    expect(first).toContain('<dialog>first request</dialog>')
    expect(first).not.toContain('second request')
    expect(second).toContain('<dialog>second request</dialog>')
    expect(second).not.toContain('first request')
  })

  it('drops a template shown outside setup without runWithApp() instead of guessing the request', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    const App = defineComponent({
      async setup() {
        await tick()
        useTemplate({ component: () => h('dialog', 'unscoped') }).show()
        return () => h(TemplateProvider, null, { default: () => h('p', 'page') })
      },
    })

    const html = await renderToString(createSSRApp(App))

    expect(html).not.toContain('unscoped')
  })
})
