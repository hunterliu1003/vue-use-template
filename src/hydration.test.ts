// @vitest-environment jsdom
import type { Component } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import { createSSRApp, defineAsyncComponent, defineComponent, h, nextTick } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { createTemplateProvider } from './createTemplateProvider'

function createApp(template: Component = () => h('dialog', 'shown in setup')) {
  const { TemplateProvider, useTemplate } = createTemplateProvider()
  const Page = defineComponent({
    setup() {
      useTemplate({ component: template }, { showByDefault: true })
      return () => h('p', 'page')
    },
  })
  return createSSRApp({
    render: () => h(TemplateProvider, null, { default: () => h(Page) }),
  })
}

describe('hydration', () => {
  it('hydrates a server-rendered template without mismatches', async () => {
    const html = await renderToString(createApp())
    const container = document.createElement('div')
    container.innerHTML = html
    const warn = vi.spyOn(console, 'warn')
    const error = vi.spyOn(console, 'error')

    createApp().mount(container)
    await nextTick()

    expect(html).toContain('<dialog>shown in setup</dialog>')
    expect([...warn.mock.calls, ...error.mock.calls].flat().join('\n')).not.toMatch(/hydration/i)
    expect(container.innerHTML).toBe(html)
  })

  it('hydrates a server-rendered async component template without mismatches', async () => {
    const AsyncDialog = () => defineAsyncComponent(async () => () => h('dialog', 'async dialog'))
    const html = await renderToString(createApp(AsyncDialog()))
    const container = document.createElement('div')
    container.innerHTML = html
    const warn = vi.spyOn(console, 'warn')
    const error = vi.spyOn(console, 'error')

    createApp(AsyncDialog()).mount(container)
    await new Promise(resolve => setTimeout(resolve))
    await nextTick()

    expect(html).toContain('<dialog>async dialog</dialog>')
    expect([...warn.mock.calls, ...error.mock.calls].flat().join('\n')).not.toMatch(/hydration/i)
    expect(container.innerHTML).toBe(html)
  })
})
