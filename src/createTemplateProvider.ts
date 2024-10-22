import { tryOnMounted, tryOnUnmounted } from '@vueuse/core'
import type { Component, MaybeRefOrGetter } from 'vue'
import { defineComponent, shallowReactive } from 'vue'
import type { Provider, Template, UseTemplate } from './types'
import { templateToVNodeFn } from './utils'

export function createTemplateProvider() {
  const provider: Provider = {
    vNodeFns: shallowReactive(new Set()),
  }

  const TemplateProvider = defineComponent({
    name: 'TemplateProvider',
    setup(_props, { slots }) {
      return () => [slots.default?.(), [...provider?.vNodeFns].map(vNodeFn => vNodeFn())]
    },
  })

  const useTemplate: UseTemplate = <T extends Component>(
    template: MaybeRefOrGetter<Template<T>>,
    options: Parameters<UseTemplate>[1] = {
      showByDefault: false,
      hideOnUnmounted: true,
    },
  ): ReturnType<UseTemplate> => {
    const vNodeFn = templateToVNodeFn(template)

    function show() {
      tryOnMounted(() => {
        provider?.vNodeFns.add(vNodeFn)
      })
    }

    function hide() {
      provider?.vNodeFns.delete(vNodeFn)
    }

    if (options?.showByDefault)
      show()

    if (options?.hideOnUnmounted)
      tryOnUnmounted(hide)

    return { show, hide }
  }

  return {
    TemplateProvider,
    useTemplate,
  }
}
