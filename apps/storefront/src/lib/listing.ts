import type { components, paths } from '@/api/schema'

type Config = components['schemas']['Config']
export type ProductQuery = NonNullable<paths['/products']['get']['parameters']['query']>
export type SearchParams = Record<string, string | string[] | undefined>

export const SORTS = [
  ['popular', 'Bán chạy'],
  ['rating', 'Đánh giá cao'],
  ['discount', 'Giảm nhiều'],
  ['price_asc', 'Giá thấp → cao'],
  ['price_desc', 'Giá cao → thấp'],
] as const
export type SortKey = (typeof SORTS)[number][0]

export const PAGE_SIZE = 24

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) || undefined

export type ListingState = { sort: SortKey; budget?: string; badge?: string; stock: boolean; page: number }

/** Reads filter/sort/page from the URL and builds the /products query for it. */
export function parseListing(sp: SearchParams, budgets: NonNullable<Config['budgets']>, base: ProductQuery = {}) {
  const sortRaw = one(sp.sort)
  const sort: SortKey = SORTS.some(([k]) => k === sortRaw) ? (sortRaw as SortKey) : 'popular'
  const budget = budgets.find((b) => b.key === one(sp.budget))
  const page = Math.max(1, Math.min(10, Number(one(sp.page)) || 1))
  const state: ListingState = { sort, budget: budget?.key, badge: one(sp.badge), stock: one(sp.stock) === '1', page }
  const query: ProductQuery = {
    ...base,
    sort,
    limit: Math.min(60, PAGE_SIZE * page),
    ...(budget ? { price_min: budget.min, price_max: budget.max } : {}),
    ...(state.badge ? { badge: state.badge } : {}),
    ...(state.stock ? { in_stock: true } : {}),
  }
  return { state, query }
}

/** Same URL with some params changed; `undefined` removes a param; page resets unless set. */
export function withParams(path: string, sp: SearchParams, patch: Record<string, string | undefined>) {
  const next = new URLSearchParams()
  for (const [k, v] of Object.entries(sp)) {
    const val = one(v)
    if (val && k !== 'page') next.set(k, val)
  }
  for (const [k, v] of Object.entries(patch)) {
    if (v) next.set(k, v)
    else next.delete(k)
  }
  const qs = next.toString()
  return qs ? `${path}?${qs}` : path
}
