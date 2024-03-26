import { tryOnUnmounted } from '@vueuse/core'
import type { Component } from 'vue'
import { nextTick } from 'vue'
import type { Template, UseTemplate } from './types'
import { templateToVNodeFn } from './utils'
import { shouldNextTick, useProvider } from './templateProvider'

/**
 * A type helper to define a template
 */
export function defineTemplate<T extends Component>(template: Template<T>) {
  return template
}

/**
 * `useTemplate()` depends on `<TemplateProvider />` to work properly.
 * This means that the Provider needs to be set up before `useTemplate()` can be used.
 *
 * However, if you try to use `useTemplate()` before `<TemplateProvider />` is ready, it will cause an error.
 * To fix this issue, we use `nextTick()` to wait until `<TemplateProvider />` is ready.
 * If it's still not ready after `nextTick()`, an error will be thrown.
 *
 * Note:
 * - Using `useTemplate()` inside `<TemplateProvider />` works with server-side rendering (SSR).
 * - Using `useTemplate()` outside of `<TemplateProvider />` won't work with SSR,
 *   but it still works fine on the client-side without causing server-side errors.
 */
export const useTemplate: UseTemplate = <T extends Component>(
  template: Template<T>,
  options: Parameters<UseTemplate>[1] = {
    showByDefault: false,
    hideOnUnmounted: true,
  },
): ReturnType<UseTemplate> => {
  const _nextTick = shouldNextTick()

  if (_nextTick)
    checkError()

  const vNodeFn = templateToVNodeFn(template)

  async function show() {
    if (_nextTick)
      await nextTick()
    const provider = useProvider()
    if (!provider?.vNodeFns.includes(vNodeFn))
      provider?.vNodeFns.push(vNodeFn)
  }

  async function hide() {
    if (_nextTick)
      await nextTick()
    const provider = useProvider()
    const index = provider?.vNodeFns.indexOf(vNodeFn)
    if (index !== undefined && index !== -1)
      provider?.vNodeFns.splice(index, 1)
  }

  if (options?.showByDefault)
    show()

  if (options?.hideOnUnmounted)
    tryOnUnmounted(hide)

  return { show, hide }
}

async function checkError() {
  await nextTick()
  const provider = useProvider()
  if (!provider)
    throw new Error('[vue-use-template] `useTemplate()` must be called within <TemplateProvider />')
}
