import type { InjectionKey } from 'vue'
import type { TemplateProvide } from './types'

export const templateProvideSymbol = Symbol('templateProvide') as InjectionKey<TemplateProvide>
