import { tryOnUnmounted } from '@vueuse/core'
import type { Component, MaybeRefOrGetter, VNode } from 'vue'
import { defineComponent, shallowReactive } from 'vue'
import { defineStore } from 'pinia'
import type { Template, TemplateStore, UseTemplate } from './types'
import { templateToVNodeFn } from './utils'
import { pinia } from './pinia'

let i = 0

export function createTemplateProvider() {
  i = i + 1
  const useTemplateStore = defineStore(`vue-use-template${i}`, {
    state: (): TemplateStore => ({
      vNodeFns: shallowReactive(new Set()),
    }),
    actions: {
      add(vNodeFn: () => VNode) {
        this.vNodeFns.add(vNodeFn)
      },
      remove(vNodeFn: () => VNode) {
        this.vNodeFns.delete(vNodeFn)
      },
    },
  })

  const templateStore = useTemplateStore(pinia)

  const TemplateProvider = defineComponent({
    name: 'TemplateProvider',
    setup(_props, { slots }) {
      return () => [slots.default?.(), [...templateStore.vNodeFns].map(vNodeFn => vNodeFn())]
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
      templateStore.add(vNodeFn)
    }

    function hide() {
      templateStore.remove(vNodeFn)
    }

    if (options?.showByDefault)
      show()

    if (options?.hideOnUnmounted)
      tryOnUnmounted(hide)

    return { show, hide }
  }

  return {
    templateStore,
    TemplateProvider,
    useTemplate,
  }
}
