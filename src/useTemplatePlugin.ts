import type { App } from 'vue'
import { getCurrentInstance, inject, ref, shallowReactive } from 'vue'
import type { TemplatePlugin } from './types'
import { useTemplatePluginSymbol } from './injectionSymbols'

let activeTemplatePlugin: TemplatePlugin | undefined

export function setActiveTemplatePlugin(templatePlugin: TemplatePlugin | undefined) {
  return activeTemplatePlugin = templatePlugin
}

const defaultTemplatePlugin: TemplatePlugin = {
  install: (_app: App) => { },
  containers: ref([]),
  vNodeFns: shallowReactive([]),
}

function getTemplatePlugin() {
  return (getCurrentInstance() && inject(useTemplatePluginSymbol, defaultTemplatePlugin)) || activeTemplatePlugin
}

/**
 * Returns the templatePlugin instance. Equivalent to using `$templatePlugin` inside templates.
 */
export function useTemplatePlugin(): TemplatePlugin {
  const templatePlugin = getTemplatePlugin()
  if (!templatePlugin) {
    throw new Error(
      '[Vue Use Template]: getTemplatePlugin was called with no active TemplatePlugin. Did you forget to install templatePlugin?\n'
      + '\tconst templatePlugin = createTemplatePlugin()\n'
      + '\tapp.use(templatePlugin)\n'
      + 'This will fail in production.',
    )
  }

  return templatePlugin!
}
