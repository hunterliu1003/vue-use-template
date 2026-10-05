import type { Component } from 'vue'
import { createSSRApp, defineComponent, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { describe, expect, it, onTestFinished, vi } from 'vitest'
import { createTemplateProvider } from './createTemplateProvider'

function renderRequest(TemplateProvider: Component, page: Component) {
  return renderToString(createSSRApp({
    render: () => h(TemplateProvider, null, { default: () => h(page) }),
  }))
}

describe('server-side rendering', () => {
  it('does not leak a template shown after an await into the next request', async () => {
    const { TemplateProvider, useTemplate } = createTemplateProvider()
    const AsyncPage = defineComponent({
      async setup() {
        const { show } = useTemplate({ component: () => h('dialog', 'leaked') })
        await Promise.resolve()
        show()
        return () => h('p', 'async page')
      },
    })

    await renderRequest(TemplateProvider, AsyncPage)

    expect(await renderRequest(TemplateProvider, () => h('p', 'next request'))).not.toContain('leaked')
  })

  it('does not leak a template between renders of a reused app', async () => {
    /** Vue itself warns when renderToString provides a new SSR context to an app it already rendered. */
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    onTestFinished(() => warn.mockRestore())
    const { TemplateProvider, useTemplate } = createTemplateProvider()
    let request = 0
    const AsyncPage = defineComponent({
      async setup() {
        const { show } = useTemplate({ component: () => h('dialog', `dialog of request ${++request}`) })
        await Promise.resolve()
        show()
        return () => h('p', 'async page')
      },
    })
    const app = createSSRApp({
      render: () => h(TemplateProvider, null, { default: () => h(AsyncPage) }),
    })

    await renderToString(app)

    expect(await renderToString(app)).not.toContain('dialog of request 1')
    expect(warn.mock.calls.every(([message]) => String(message).includes('Symbol(v-scx)'))).toBe(true)
  })

  it('ignores show() called outside any component on the server', async () => {
    const { TemplateProvider, useTemplate } = createTemplateProvider()

    useTemplate({ component: () => h('dialog', 'leaked') }).show()

    expect(await renderRequest(TemplateProvider, () => h('p', 'page'))).not.toContain('leaked')
  })
})
