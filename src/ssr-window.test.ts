// @vitest-environment jsdom
import { createSSRApp, defineComponent, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { describe, expect, it } from 'vitest'
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
})
