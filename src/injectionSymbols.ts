import type { InjectionKey } from 'vue'
import type { TemplateProvide } from './types'

export const templateSymbol = Symbol('template') as InjectionKey<TemplateProvide>
