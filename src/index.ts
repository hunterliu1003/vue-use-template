/** Types */
export type {
  Provider,
  Template,
  UseTemplate,
} from './types'

export {
  defineTemplate,
  useTemplate,
} from './useTemplate'

export {
  TemplateProvider,
} from './templateProvider'

export {
  isTemplate,
  templateToVNodeFn,
  mergeTemplateAttrs,
} from './utils'
