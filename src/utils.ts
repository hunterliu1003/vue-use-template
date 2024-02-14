export const isString = (value: unknown): value is string => typeof value === 'string'

type Entries<T> = { [K in keyof T]: [K, T[K]] }[keyof T][]
/**
 * Type safe variant of `Object.entries()`
 */
export function objectEntries<T extends Record<any, any>>(object: T): Entries<T> {
  return Object.entries(object) as any
}
