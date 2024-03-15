import { tryOnUnmounted } from '@vueuse/core'
import type { Component, VNode } from 'vue'
import { defineComponent, h, inject, provide, shallowReactive } from 'vue'
import type { Template, UseTemplate } from './types'
import { templateToVNodeFn } from './utils'
import { templateSymbol } from './injectionSymbols'

const TemplateContainer = defineComponent({
  name: 'TemplateContainer',
  setup() {
    const { vNodeFns } = inject(templateSymbol, { vNodeFns: [] })
    return () => vNodeFns.map(vNodeFn => vNodeFn())
  },
})

export const TemplateProvider = defineComponent({
  name: 'TemplateProvider',
  setup(_props, { slots }) {
    const vNodeFns: (() => VNode)[] = shallowReactive([])
    provide(templateSymbol, { vNodeFns })
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
  const templateContext = inject(templateSymbol)

  if (!templateContext)
    throw new Error('useTemplate must be called within TemplateProvider')

  const { vNodeFns } = templateContext
  const vNodeFn = templateToVNodeFn(template)

  async function show() {
    if (!vNodeFns.includes(vNodeFn))
      vNodeFns.push(vNodeFn)
  }

  async function hide() {
    const index = vNodeFns.indexOf(vNodeFn)
    if (index !== undefined && index !== -1)
      vNodeFns.splice(index, 1)
  }

  if (options?.hideOnUnmounted)
    tryOnUnmounted(hide)

  return { show, hide }
}
