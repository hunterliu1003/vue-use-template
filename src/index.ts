/** Types */
import { createTemplateProvider } from './createTemplateProvider'

export type {
  TemplateStore as Provider,
  Template,
  UseTemplate,
} from './types'

export {
  isTemplate,
  templateToVNodeFn,
  mergeTemplateAttrs,
  defineTemplate,
} from './utils'

export * from './plugin'

export { createTemplateProvider }

export const { templateStore, TemplateProvider, useTemplate } = createTemplateProvider()
