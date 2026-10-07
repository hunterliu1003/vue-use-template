// @vitest-environment jsdom

import { describe, expect, it, onTestFinished, vi } from 'vitest'
import { createSSRApp, defineComponent, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { createTemplateProvider } from './createTemplateProvider'

describe('server-side rendering with window defined', () => {
  it('keeps renders isolated from each other', async () => {
    const { TemplateProvider, useTemplate } = createTemplateProvider()
    const AsyncPage = defineComponent({
      async setup() {
        const { show } = useTemplate({ component: () => h('dialog', 'leaked') })
        await Promise.resolve()
        show()
        return () => h('p', 'async page')
      },
    })
    await renderToString(createSSRApp({
      render: () => h(TemplateProvider, null, { default: () => h(AsyncPage) }),
    }))

    const nextRequest = await renderToString(createSSRApp({
      render: () => h(TemplateProvider, null, { default: () => h('p', 'next request') }),
    }))

    expect(nextRequest).not.toContain('leaked')
  })

  it('ignores show() from a useTemplate() called after an await, with a warning', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    onTestFinished(() => warn.mockRestore())
    const { TemplateProvider, useTemplate } = createTemplateProvider()
    const AsyncPage = defineComponent({
      async setup() {
        await Promise.resolve()
        useTemplate({ component: () => h('dialog', 'leaked') }).show()
        return () => h('p', 'async page')
      },
    })

    await renderToString(createSSRApp({
      render: () => h(TemplateProvider, null, { default: () => h(AsyncPage) }),
    }))

    expect(warn).toHaveBeenCalledOnce()
    expect(warn.mock.calls[0][0]).toContain('outside a component on the server')
  })
})
