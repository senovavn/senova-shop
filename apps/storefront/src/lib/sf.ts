'use client'

import type { components } from '@/api/schema'

export type S = components['schemas']

/** GET a public Storefront API resource through the /api/sf BFF route (Client Components only). */
export async function sfGet<T>(path: string, query?: Record<string, string | number | boolean | undefined>): Promise<T> {
  const qs = new URLSearchParams()
  for (const [k, v] of Object.entries(query ?? {})) if (v !== undefined && v !== '') qs.set(k, String(v))
  const res = await fetch(`/api/sf/${path}${qs.size ? `?${qs}` : ''}`, { headers: { Accept: 'application/json' } })
  if (!res.ok) throw new Error(`${path}: ${res.status}`)
  return (await res.json()) as T
}
