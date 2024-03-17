import { defineComponent, getCurrentInstance, h, inject, provide, shallowReactive } from 'vue'
import type { Provider } from './types'
import { providerSymbol } from './utils'

// eslint-disable-next-line import/no-mutable-exports
export let activeProvider: Provider | undefined

const TemplateContainer = defineComponent({
  name: 'TemplateContainer',
  setup() {
    const provider = useProvider()
    return () => provider?.vNodeFns.map(vNodeFn => vNodeFn())
  },
})

export const TemplateProvider = defineComponent({
  name: 'TemplateProvider',
  setup(_props, { slots }) {
    initProvider()
    return () => [slots.default?.(), h(TemplateContainer)]
  },
})

export function useProvider() {
  return getCurrentInstance()
    /** Do not give a default value to inject, so that it will throw an error if not provided */
    ? inject(providerSymbol)
    : activeProvider
}

function initProvider() {
  const provider = createProvider()
  provide(providerSymbol, provider)
  activeProvider = provider
}

function createProvider(): Provider {
  const useTemplateProvide: Provider = {
    vNodeFns: shallowReactive([]),
  }
  return useTemplateProvide
}

/**
 * activeProvider should in front of useProvider()
 */
export function shouldNextTick() {
  return !activeProvider || !useProvider()
}
