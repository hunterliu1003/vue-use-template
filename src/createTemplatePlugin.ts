import { tryOnUnmounted } from '@vueuse/core'
import type { Component, ComputedRef, Ref, VNode } from 'vue'
import { defineComponent, h, inject, isRef, provide, shallowReactive, unref } from 'vue'
import type { ComponentEmit, ComponentProps, ComponentSlots } from 'vue-component-type-helpers'
import type { Template, UseTemplate } from './types'
import { isString, objectEntries } from './utils'
import { templateProvideSymbol } from './injectionSymbols'

export const TemplateProvider = defineComponent({
  name: 'TemplateProvider',
  setup(_props, { slots }) {
    const vNodeFns: (() => VNode)[] = shallowReactive([])

    provide(templateProvideSymbol, { vNodeFns })

    return () => [slots.default?.(), vNodeFns.map(vNodeFn => vNodeFn())]
  },
})

export const useTemplate: UseTemplate = <T extends Component>(
  template: Template<T>,
  options: Parameters<UseTemplate>[1] = {
    hideOnUnmounted: true,
  },
): ReturnType<UseTemplate> => {
  const templateContext = inject(templateProvideSymbol)

  if (!templateContext)
    throw new Error('useTemplate must be called within TemplateProvider')

  const { vNodeFns } = templateContext
  const vNodeFn = templateToVNodeFn(template)
  const show = async () => pushVNode(vNodeFns, vNodeFn)
  const hide = async () => deleteVNode(vNodeFns, vNodeFn)

  if (options?.hideOnUnmounted)
    tryOnUnmounted(hide)

  return { show, hide }
}

function pushVNode(vNodeFns: (() => VNode)[], vNodeFn: () => VNode) {
  if (!vNodeFns.includes(vNodeFn))
    vNodeFns.push(vNodeFn)
}

function deleteVNode(vNodeFns: (() => VNode)[], vNodeFn: () => VNode): void {
  const index = vNodeFns.indexOf(vNodeFn)
  if (index !== undefined && index !== -1)
    vNodeFns.splice(index, 1)
}

/**
 * A type helper to define a template
 */
export function defineTemplate<T extends Component>(template: Template<T>) {
  return template
}

export function isTemplate<T extends Component>(value: unknown): value is Template<T> {
  if (typeof value === 'object' && value !== null)
    return 'component' in value
  else
    return false
}

/**
 * Create a vNode by passing template.
 */
export function templateToVNodeFn<T extends Component>(template: Template<T>): () => VNode {
  const key = Symbol('vNodeFnKey')
  return () => {
    const attrs = mergeTemplateAttrs(template)
    Object.assign(attrs, { key })
    return h(template.component, attrs, getSlots(template.slots))
  }
}

function getSlots<T extends Component>(slots?: {
  [K in keyof ComponentSlots<T>]?: string | Component | Template<Component>
}) {
  return objectEntries(slots || {}).reduce<Record<string, () => VNode>>((acc, cur) => {
    const slotName = cur[0] as string
    const slot = cur[1] as string | Component | Template<Component>
    if (isString(slot))
      acc[slotName] = () => h('div', { innerHTML: slot })
    else if (isTemplate(slot))
      acc[slotName] = () => h(slot.component, mergeTemplateAttrs(slot), slot.slots ? getSlots(slot.slots) : undefined)
    else
      acc[slotName] = () => h(slot)
    return acc
  }, {})
}

function getAttrsFromByTemplate<T extends Component>(attrsOrPropsOrEmits?: ComponentProps<T> | Ref<ComponentProps<T>> | ComputedRef<ComponentProps<T>> | ComponentEmit<T>) {
  return isRef(attrsOrPropsOrEmits) ? unref(attrsOrPropsOrEmits) : attrsOrPropsOrEmits
}

function mergeTemplateAttrs<T extends Component>(template: Template<T>) {
  return {
    ...getAttrsFromByTemplate(template?.attrs),
    ...getAttrsFromByTemplate(template?.props),
    ...getAttrsFromByTemplate(template?.emits),
  }
}
