import type { Component, ComputedRef, Ref, VNode } from 'vue'
import type { ComponentProps, ComponentSlots } from 'vue-component-type-helpers'

type PickComponentEmits<T extends object> = {
  [K in keyof T as K extends `on${Capitalize<string>}` ? K : never]: T[K]
}
type PickComponentProps<T extends object> = {
  [K in keyof T as K extends `on${Capitalize<string>}` ? never : K]: T[K]
}

type MaybeRefOrComputedRef<T> = T | Ref<T> | ComputedRef<T>

export interface Template<T extends Component> {
  component: T
  attrs?: MaybeRefOrComputedRef<ComponentProps<T>>
  emits?: MaybeRefOrComputedRef<PickComponentEmits<ComponentProps<T>>>
  props?: MaybeRefOrComputedRef<PickComponentProps<ComponentProps<T>>>
  slots?: {
    [K in keyof ComponentSlots<T>]?: string | Component | Template<Component>
  }
}

export interface Provider {
  vNodeFns: (() => VNode)[]
}

export type UseTemplate = <T extends Component>(
  template: Template<T>,
  options?: { hideOnUnmounted?: boolean }
) => {
  show: () => Promise<void>
  hide: () => Promise<void>
}
