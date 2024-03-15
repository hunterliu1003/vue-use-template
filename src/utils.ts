import { h, isRef, unref } from 'vue'
import type { Component, ComputedRef, InjectionKey, Ref, VNode } from 'vue'
import type { ComponentEmit, ComponentProps, ComponentSlots } from 'vue-component-type-helpers'
import type { Template, UseTemplateProvider } from './types'

export const useTemplateProviderSymbol = Symbol('useTemplateProvider') as InjectionKey<UseTemplateProvider>

export function isTemplate<T extends Component>(value: unknown): value is Template<T> {
  if (typeof value === 'object' && value !== null)
    return 'component' in value
  else
    return false
}

/**
 * Create a vNode by passing `Template`.
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

function mergeTemplateAttrs<T extends Component>(template: Template<T>) {
  return {
    ...getAttrsFromByTemplate(template?.attrs),
    ...getAttrsFromByTemplate(template?.props),
    ...getAttrsFromByTemplate(template?.emits),
  }
}

function getAttrsFromByTemplate<T extends Component>(attrsOrPropsOrEmits?: ComponentProps<T> | Ref<ComponentProps<T>> | ComputedRef<ComponentProps<T>> | ComponentEmit<T>) {
  return isRef(attrsOrPropsOrEmits) ? unref(attrsOrPropsOrEmits) : attrsOrPropsOrEmits
}

function isString(value: unknown): value is string {
  return typeof value === 'string'
}

type Entries<T> = { [K in keyof T]: [K, T[K]] }[keyof T][]
/**
 * Type safe variant of `Object.entries()`
 */
function objectEntries<T extends Record<any, any>>(object: T): Entries<T> {
  return Object.entries(object) as any
}
