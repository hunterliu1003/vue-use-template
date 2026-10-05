import type { InjectionKey } from 'vue'
import { hasInjectionContext, inject } from 'vue'

export const isClient = typeof window !== 'undefined' && typeof document !== 'undefined'

let renderedOnServer = false

/** Some servers polyfill `window`: once a server render is seen, `isClient` alone can no longer be trusted. */
export function markServerRender() {
  renderedOnServer = true
}

export interface InstanceResolver<T> {
  resolve: (explicit?: T) => T | undefined
  setActive: (instance: T | undefined) => void
}

export function createInstanceResolver<T>(key: InjectionKey<T>): InstanceResolver<T> {
  let active: T | undefined

  return {
    resolve(explicit) {
      if (explicit)
        return explicit

      if (hasInjectionContext()) {
        const injected = inject(key, null)
        if (injected)
          return injected
      }

      /** The active instance is shared by every concurrent request: on the server it would hand one request's instance to another. */
      return isClient && !renderedOnServer ? active : undefined
    },
    setActive(instance) {
      active = instance
    },
  }
}
