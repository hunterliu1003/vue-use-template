/** Types */
import { createTemplateProvider, createTemplateProviderComponent, createTemplateState, createUseTemplate } from './createTemplateProvider'

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

/** Only pure calls at the top level: destructuring or reading a property here keeps bundlers from dropping the default provider. */
const defaultState = /* @__PURE__ */ createTemplateState()
export const TemplateProvider = /* @__PURE__ */ createTemplateProviderComponent(defaultState)
export const useTemplate = /* @__PURE__ */ createUseTemplate(defaultState)
