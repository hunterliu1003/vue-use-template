import { tryOnUnmounted } from '@vueuse/core'
import type { Component } from 'vue'
import { defineComponent, getCurrentInstance, h, inject, nextTick, provide, shallowReactive } from 'vue'
import type { Template, UseTemplate, UseTemplateProvider } from './types'
import { templateToVNodeFn, useTemplateProviderSymbol } from './utils'

let activeUseTemplateProvide: UseTemplateProvider | undefined

function useTemplateProvider() {
  return getCurrentInstance() ? inject(useTemplateProviderSymbol) : activeUseTemplateProvide
}

const TemplateContainer = defineComponent({
  name: 'TemplateContainer',
  setup() {
    const { vNodeFns } = inject(useTemplateProviderSymbol, { vNodeFns: [] })
    return () => vNodeFns.map(vNodeFn => vNodeFn())
  },
})

export const TemplateProvider = defineComponent({
  name: 'TemplateProvider',
  setup(_props, { slots }) {
    const useTemplateProvide: UseTemplateProvider = {
      vNodeFns: shallowReactive([]),
    }
    provide(useTemplateProviderSymbol, useTemplateProvide)
    activeUseTemplateProvide = useTemplateProvide
    return () => [slots.default?.(), h(TemplateContainer)]
  },
})

/**
 * A type helper to define a template
 */
export function defineTemplate<T extends Component>(template: Template<T>) {
  return template
}

export const useTemplate: UseTemplate = <T extends Component>(
  template: Template<T>,
  options: Parameters<UseTemplate>[1] = {
    hideOnUnmounted: true,
  },
): ReturnType<UseTemplate> => {
  const currentInstance = getCurrentInstance()
  const injectedTemplateProvide = (currentInstance && activeUseTemplateProvide) ? inject(useTemplateProviderSymbol) : undefined
  const shouldNextTick = !!currentInstance && !injectedTemplateProvide

  nextTick(() => {
    if (!activeUseTemplateProvide)
      throw new Error('useTemplate must be called within TemplateProvider')
  })

  if (options?.hideOnUnmounted)
    tryOnUnmounted(hide)

  const vNodeFn = templateToVNodeFn(template)

  async function show() {
    if (shouldNextTick)
      await nextTick()
    const { vNodeFns } = useTemplateProvider()!
    if (!vNodeFns.includes(vNodeFn))
      vNodeFns.push(vNodeFn)
  }

  async function hide() {
    if (shouldNextTick)
      await nextTick()
    const { vNodeFns } = useTemplateProvider()!
    const index = vNodeFns.indexOf(vNodeFn)
    if (index !== undefined && index !== -1)
      vNodeFns.splice(index, 1)
  }

  return { show, hide }
}
