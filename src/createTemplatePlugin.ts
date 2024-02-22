import { tryOnUnmounted } from '@vueuse/core'
import type { App, Component, ComputedRef, Ref, VNode } from 'vue'
import { computed, defineComponent, h, isRef, onBeforeUnmount, ref, shallowReactive, unref } from 'vue'
import type { ComponentEmit, ComponentProps, ComponentSlots } from 'vue-component-type-helpers'
import type { Template, TemplatePlugin, UseTemplate } from './types'
import { isString, objectEntries } from './utils'
import { useTemplatePluginSymbol } from './injectionSymbols'
import { setActiveTemplatePlugin, useTemplatePlugin } from './useTemplatePlugin'

export function createTemplatePlugin() {
  const vNodeFns: (() => VNode)[] = shallowReactive([])
  const containers = ref<symbol[]>([])

  const templatePlugin: TemplatePlugin = {
    install: (app: App) => {
      app.provide(useTemplatePluginSymbol, templatePlugin)
    },
    vNodeFns,
    containers,
  }

  setActiveTemplatePlugin(templatePlugin)

  return templatePlugin
}

export const Container = defineComponent({
  name: 'Container',
  setup() {
    const { vNodeFns, containers } = useTemplatePlugin()
    const uid = Symbol('uid')
    const shouldMount = computed(() => uid === containers.value?.[0])
    containers.value.push(uid)
    onBeforeUnmount(() => {
      containers.value = containers.value.filter(i => i !== uid)
    })

    return () => shouldMount.value ? vNodeFns.map(vNodeFn => vNodeFn()) : null
  },
})

export const useTemplate: UseTemplate = <T extends Component>(
  template: Template<T>,
  options: Parameters<UseTemplate>[1] = {
    hideOnUnmounted: true,
  },
): ReturnType<UseTemplate> => {
  const vNodeFn = templateToVNodeFn(template)
  const show = async () => pushVNode(vNodeFn)
  const hide = async () => deleteVNode(vNodeFn)

  if (options?.hideOnUnmounted)
    tryOnUnmounted(hide)

  return { show, hide }
}

function pushVNode(vNodeFn: () => VNode) {
  const { vNodeFns } = useTemplatePlugin()
  if (!vNodeFns.includes(vNodeFn))
    vNodeFns.push(vNodeFn)
}

function deleteVNode(vNodeFn: () => VNode): void {
  const { vNodeFns } = useTemplatePlugin()
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
