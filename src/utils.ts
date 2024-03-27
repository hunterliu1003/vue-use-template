import { h, toValue, unref } from 'vue'
import type { Component, InjectionKey, VNode } from 'vue'
import type { ComponentSlots } from 'vue-component-type-helpers'
import type { MaybeRefOrComputedRef, Provider, Template } from './types'

export const providerSymbol = Symbol(import.meta.env.DEV ? 'provider' : '') as InjectionKey<Provider>

export function isTemplate<T extends Component>(template: unknown): template is Template<T> {
  const _template = toValue(template)
  if (typeof _template === 'object' && _template !== null)
    return 'component' in _template
  else
    return false
}

/**
 * Create a vNode by passing `Template`.
 */
export function templateToVNodeFn<T extends Component>(template: MaybeRefOrComputedRef<Template<T>>): () => VNode {
  const key = Symbol(import.meta.env.DEV ? 'vNodeFnKey' : '')
  return () => {
    const _template = unref(template)
    const attrs = mergeTemplateAttrs(_template)
    Object.assign(attrs, { key })
    return h(unref(_template.component), attrs, getSlots(unref(_template.slots)))
  }
}

function getSlots<T extends Component>(slots?: {
  [K in keyof ComponentSlots<T>]?: string | Component | Template<Component>
}) {
  return objectEntries(slots || {}).reduce<Record<string, () => VNode>>((acc, cur) => {
    const slotName = cur[0] as string
    const slot = cur[1] as string | Component | Template<Component>
    if (typeof slot === 'string')
      acc[slotName] = () => h('div', { innerHTML: slot })
    else if (isTemplate(slot))
      acc[slotName] = () => h(slot.component, mergeTemplateAttrs(slot), slot.slots ? getSlots(slot.slots) : undefined)
    else
      acc[slotName] = () => h(slot)
    return acc
  }, {})
}

export function mergeTemplateAttrs<T extends Component>(template: Template<T>) {
  return {
    ...unref(template?.attrs),
    ...unref(template?.props),
    ...unref(template?.emits),
  }
}

type Entries<T> = { [K in keyof T]: [K, T[K]] }[keyof T][]
/**
 * Type safe variant of `Object.entries()`
 */
function objectEntries<T extends Record<any, any>>(object: T): Entries<T> {
  return Object.entries(object) as any
}
