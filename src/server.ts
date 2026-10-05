import type { App } from 'vue'
import { AsyncLocalStorage } from 'node:async_hooks'
import { setScopedAppResolver } from './createInstanceResolver'

const storage = new AsyncLocalStorage<App>()

/**
 * Run a server render with `app` as the current app of its async call chain, so templates and instances used
 * outside setup (after an `await`, in a store or a helper) resolve to this request even under concurrency.
 *
 * @example
 * const html = await runWithApp(app, () => renderToString(app))
 */
export function runWithApp<R>(app: App, fn: () => R): R {
  setScopedAppResolver(() => storage.getStore())
  return storage.run(app, fn)
}
