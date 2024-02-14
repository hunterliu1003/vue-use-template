import type { App, Component, Ref, VNode } from 'vue'
import type { ComponentProps, ComponentSlots } from 'vue-component-type-helpers'

export interface Template<T extends Component> {
  component: T
  attrs?: ComponentProps<T>
  slots?: {
    [K in keyof ComponentSlots<T>]?: string | Component | Template<Component>
  }
}

export interface TemplatePlugin {
  install: (app: App) => void
  vNodeFns: (() => VNode)[]
  containers: Ref<symbol[]>
}

export type UseTemplate = <T extends Component>(
  template: Template<T>,
  options?: { onUnmounted?: (() => void) }
) => {
  show: () => Promise<void>
  hide: () => Promise<void>
}
