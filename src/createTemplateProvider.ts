import { isClient, tryOnUnmounted } from '@vueuse/core'
import type { Component, MaybeRefOrGetter } from 'vue'
import { defineComponent, getCurrentInstance, h, shallowReactive, useSSRContext } from 'vue'
import type { Provider, Template, UseTemplate } from './types'
import { templateToVNodeFn } from './utils'

function createProvider(): Provider {
  return {
    vNodeFns: shallowReactive(new Set()),
  }
}

export function createTemplateProvider() {
  const clientProvider = createProvider()
  /** Keyed by SSR context rather than app: every render gets a fresh context, even when an app is reused across requests. */
  const serverProviders = new WeakMap<object, Provider>()

  function resolveProvider(): Provider | undefined {
    if (isClient)
      return clientProvider

    const ssrContext = getCurrentInstance() ? useSSRContext() : undefined
    if (!ssrContext)
      return undefined

    let provider = serverProviders.get(ssrContext)
    if (!provider) {
      provider = createProvider()
      serverProviders.set(ssrContext, provider)
    }
    return provider
  }

  const TemplateProvider = defineComponent({
    name: 'TemplateProvider',
    setup(_props, { slots }) {
      const provider = resolveProvider()
      /** A separate component rendered after the slot, so templates shown while the slot sets up are already registered on the server and while hydrating. */
      const TemplateOutlet = () => [...(provider?.vNodeFns ?? [])].map(vNodeFn => vNodeFn())
      return () => [slots.default?.(), h(TemplateOutlet)]
    },
  })

  const useTemplate: UseTemplate = <T extends Component>(
    template: MaybeRefOrGetter<Template<T>>,
    { showByDefault = false, hideOnUnmounted = true }: Parameters<UseTemplate>[1] = {},
  ): ReturnType<UseTemplate> => {
    const provider = resolveProvider()
    const vNodeFn = templateToVNodeFn(template)

    function show() {
      provider?.vNodeFns.add(vNodeFn)
    }

    function hide() {
      provider?.vNodeFns.delete(vNodeFn)
    }

    if (showByDefault)
      show()

    if (hideOnUnmounted)
      tryOnUnmounted(hide)

    return { show, hide }
  }

  return {
    TemplateProvider,
    useTemplate,
  }
}
