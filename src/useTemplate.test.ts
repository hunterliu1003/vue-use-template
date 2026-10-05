// @vitest-environment jsdom
import { createApp, defineComponent, h, nextTick, ref } from 'vue'
import { describe, expect, it } from 'vitest'
import { createTemplateProvider } from './createTemplateProvider'

describe('useTemplate options', () => {
  it('still hides on unmount when only showByDefault is passed', async () => {
    const { TemplateProvider, useTemplate } = createTemplateProvider()
    const visible = ref(true)
    const Child = defineComponent({
      setup() {
        useTemplate({ component: () => h('dialog', 'owned by child') }, { showByDefault: true })
        return () => h('p')
      },
    })
    const el = document.createElement('div')
    createApp({
      render: () => h(TemplateProvider, null, { default: () => (visible.value ? h(Child) : null) }),
    }).mount(el)
    expect(el.innerHTML).toContain('owned by child')

    visible.value = false
    await nextTick()

    expect(el.innerHTML).not.toContain('owned by child')
  })
})

describe('rendering open templates', () => {
  it('does not re-render an open template without slots when another one opens', async () => {
    const { TemplateProvider, useTemplate } = createTemplateProvider()
    let renders = 0
    const Dialog = defineComponent({
      props: { title: String },
      setup: props => () => {
        renders++
        return h('dialog', props.title)
      },
    })
    createApp({ render: () => h(TemplateProvider) }).mount(document.createElement('div'))
    useTemplate({ component: Dialog, props: { title: 'already open' } }).show()
    await nextTick()
    renders = 0

    useTemplate({ component: () => h('dialog', 'another') }).show()
    await nextTick()

    expect(renders).toBe(0)
  })
})
