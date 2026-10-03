import vi from './messages/vi.json'

type Messages = typeof vi
type Leaves<T, P extends string = ''> = {
  [K in keyof T & string]: T[K] extends string ? `${P}${K}` : Leaves<T[K], `${P}${K}.`>
}[keyof T & string]
export type MessageKey = Leaves<Messages>

/** Vietnamese UI strings (en.json mirrors the shape for later). `{name}` placeholders are filled from vars. */
export function t(key: MessageKey, vars?: Record<string, string | number>): string {
  const raw = key.split('.').reduce<unknown>((node, k) => (node as Record<string, unknown>)[k], vi) as string
  return vars ? raw.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? `{${k}}`)) : raw
}
