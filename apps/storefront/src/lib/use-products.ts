'use client'

import { useQueries } from '@tanstack/react-query'
import { sfGet, type S } from './sf'

/** Fetches products by id or slug through the BFF (cached per key). */
export function useProducts(keys: string[]) {
  return useQueries({
    queries: keys.map((k) => ({ queryKey: ['product', k], queryFn: () => sfGet<S['Product']>(`products/${k}`), staleTime: 60_000 })),
    combine: (rs) => rs.map((r) => r.data),
  })
}
