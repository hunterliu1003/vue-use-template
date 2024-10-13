/** Types */
import { createTemplateProvider } from './createTemplateProvider'

export type {
  Provider,
  Template,
  UseTemplate,
} from './types'

export {
  isTemplate,
  templateToVNodeFn,
  mergeTemplateAttrs,
  defineTemplate,
} from './utils'

export { createTemplateProvider }

export const { TemplateProvider, useTemplate } = createTemplateProvider()
