import type { Component, MaybeRefOrGetter } from 'vue'
import type { Provider, Template, UseTemplate } from './types'
import { defineComponent, getCurrentInstance, h, inject, onUnmounted, shallowReactive, ssrContextKey } from 'vue'
import { templateToVNodeFn } from './utils'

const isClient = typeof window !== 'undefined' && typeof document !== 'undefined'

function createProvider(): Provider {
  return {
    vNodeFns: shallowReactive(new Set()),
  }
}

export function createTemplateState() {
  const clientProvider = createProvider()
  /** Keyed by SSR context rather than app: every render gets a fresh context, even when an app is reused across requests. */
  const serverProviders = new WeakMap<object, Provider>()

  function resolveProvider(): Provider | undefined {
    if (!getCurrentInstance())
      return isClient ? clientProvider : undefined

    /** The SSR context, not `window`, tells a server render apart: some servers polyfill `window`. */
    const ssrContext = inject(ssrContextKey, null)
    if (!ssrContext)
      return clientProvider

    let provider = serverProviders.get(ssrContext)
    if (!provider) {
      provider = createProvider()
      serverProviders.set(ssrContext, provider)
    }
    return provider
  }

  return { resolveProvider }
}

type TemplateState = ReturnType<typeof createTemplateState>

export function createTemplateProviderComponent({ resolveProvider }: TemplateState) {
  return defineComponent({
    name: 'TemplateProvider',
    setup(_props, { slots }) {
      const provider = resolveProvider()
      /** A separate component rendered after the slot, so templates shown while the slot sets up are already registered on the server and while hydrating. */
      const TemplateOutlet = () => [...(provider?.vNodeFns ?? [])].map(vNodeFn => vNodeFn())
      return () => [slots.default?.(), h(TemplateOutlet)]
    },
  })
}

export function createUseTemplate({ resolveProvider }: TemplateState): UseTemplate {
  return <T extends Component>(
    template: MaybeRefOrGetter<Template<T>>,
    { showByDefault = false, hideOnUnmounted = true }: Parameters<UseTemplate>[1] = {},
  ): ReturnType<UseTemplate> => {
    const provider = resolveProvider()
    const vNodeFn = templateToVNodeFn(template)

    function show() {
      provider?.vNodeFns.add(vNodeFn)
      // eslint-disable-next-line node/prefer-global/process -- bundlers only replace the global process.env.NODE_ENV
      if (!provider && process.env.NODE_ENV !== 'production')
        console.warn('[vue-use-template] show() is ignored: useTemplate() was called outside a component on the server.')
    }

    function hide() {
      provider?.vNodeFns.delete(vNodeFn)
    }

    if (showByDefault)
      show()

    if (hideOnUnmounted && getCurrentInstance())
      onUnmounted(hide)

    return { show, hide }
  }
}

export function createTemplateProvider() {
  const state = createTemplateState()
  return {
    TemplateProvider: createTemplateProviderComponent(state),
    useTemplate: createUseTemplate(state),
  }
}
