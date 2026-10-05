import type { App, Component, InjectionKey, MaybeRefOrGetter } from 'vue'
import type { Provider, Template, TemplateState, UseTemplate } from './types'
import { defineComponent, getCurrentInstance, h, hasInjectionContext, inject, onUnmounted, shallowReactive, ssrContextKey, warn } from 'vue'
import { createInstanceResolver, getScopedApp, isClient, markServerRender } from './createInstanceResolver'
import { templateToVNodeFn } from './utils'

const templateStateKey: InjectionKey<TemplateState> = /* @__PURE__ */ Symbol('vue-use-template')
const stateResolver = /* @__PURE__ */ createInstanceResolver(templateStateKey)

export function resolveInstalledTemplateState(): TemplateState | undefined {
  return stateResolver.resolve()
}

export function createProvider(): Provider {
  return {
    vNodeFns: shallowReactive(new Set()),
  }
}

function resolveSsrContext(): object | null {
  if (hasInjectionContext())
    return inject(ssrContextKey, null)
  return getScopedApp()?.runWithContext(() => inject(ssrContextKey, null)) ?? null
}

export function createTemplateState(): TemplateState {
  const clientProvider = createProvider()
  /** Keyed by SSR context rather than app: every render gets a fresh context, even when an app is reused across requests. */
  const serverProviders = new WeakMap<object, Provider>()

  const state: TemplateState = {
    install(app: App) {
      app.provide(templateStateKey, state)
      stateResolver.setActive(state)
    },
    resolveProvider() {
      /** The SSR context, not `window`, tells a server render apart: some servers polyfill `window`. */
      const ssrContext = resolveSsrContext()
      if (!ssrContext)
        return isClient ? clientProvider : undefined

      markServerRender()
      let provider = serverProviders.get(ssrContext)
      if (!provider) {
        provider = createProvider()
        serverProviders.set(ssrContext, provider)
      }
      return provider
    },
  }
  return state
}

function renderTemplates(provider: Provider | undefined) {
  return [...(provider?.vNodeFns ?? [])].map(vNodeFn => vNodeFn())
}

export function createTemplateProviderComponent(getState: () => TemplateState) {
  return defineComponent({
    name: 'TemplateProvider',
    setup(_props, { slots }) {
      const provider = getState().resolveProvider()
      /** A separate component rendered after the slot, so templates shown while the slot sets up are already registered on the server and while hydrating. */
      const TemplateOutlet = () => renderTemplates(provider)
      return () => [slots.default?.(), h(TemplateOutlet)]
    },
  })
}

/** Render the templates of `state` anywhere in the tree, for libraries that place the outlet themselves. */
export function createTemplateOutlet(state: TemplateState) {
  return defineComponent({
    name: 'TemplateOutlet',
    setup() {
      const provider = state.resolveProvider()
      return () => renderTemplates(provider)
    },
  })
}

export function createUseTemplateFrom(getState: () => TemplateState): UseTemplate {
  return <T extends Component>(
    template: MaybeRefOrGetter<Template<T>>,
    { showByDefault = false, hideOnUnmounted = true }: Parameters<UseTemplate>[1] = {},
  ): ReturnType<UseTemplate> => {
    const provider = getState().resolveProvider()
    const vNodeFn = templateToVNodeFn(template)

    function show() {
      if (provider)
        provider.vNodeFns.add(vNodeFn)
      else
        warn('vue-use-template: show() is ignored because useTemplate() was called outside a component on the server. Wrap the render in runWithApp() from vue-use-template/server.')
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

export function createUseTemplate(state: TemplateState): UseTemplate {
  return createUseTemplateFrom(() => state)
}

export function createTemplateProvider() {
  const state = createTemplateState()
  return {
    TemplateProvider: createTemplateProviderComponent(() => state),
    useTemplate: createUseTemplate(state),
    install: state.install,
  }
}
