import type { Component, MaybeRefOrGetter, VNode } from 'vue'
import type { ComponentProps, ComponentSlots } from 'vue-component-type-helpers'

type PickComponentEmits<T extends object> = {
  [K in keyof T as K extends `on${Capitalize<string>}` ? K : never]: T[K]
}
type PickComponentProps<T extends object> = {
  [K in keyof T as K extends `on${Capitalize<string>}` ? never : K]: T[K]
}

export interface Template<T extends Component> {
  component: T
  attrs?: MaybeRefOrGetter<ComponentProps<T>>
  emits?: MaybeRefOrGetter<PickComponentEmits<ComponentProps<T>>>
  props?: MaybeRefOrGetter<PickComponentProps<ComponentProps<T>>>
  slots?: {
    [K in keyof ComponentSlots<T>]?: string | Component | Template<Component>
  }
}

export interface TemplateStore {
  vNodeFns: Set<() => VNode>
}

export type UseTemplate = <T extends Component>(
  template: MaybeRefOrGetter<Template<T>>,
  options?: {
    showByDefault?: boolean
    hideOnUnmounted?: boolean
  }
) => {
  show: () => void
  hide: () => void
}
