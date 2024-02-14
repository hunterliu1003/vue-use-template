import type { InjectionKey } from 'vue'
import type { TemplatePlugin } from './types'

export const useTemplatePluginSymbol = Symbol('useTemplatePlugin') as InjectionKey<TemplatePlugin>
