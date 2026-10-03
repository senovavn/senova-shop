import { http, HttpResponse } from 'msw'
import type { components } from '@/api/schema'
import { mockCollections, mockFlashSale, mockBanners, mockProvinces, mockStories, mockVouchers } from './content'
import { mockConfig, mockProducts, productById } from './data'

type Product = components['schemas']['Product']

const price = (p: Product) => p.variants[0]?.price ?? 0
const discount = (p: Product) => {
  const v = p.variants[0]
  return v?.compare_at ? 1 - v.price / v.compare_at : 0
}
const SORTS: Record<string, (a: Product, b: Product) => number> = {
  popular: (a, b) => (b.sold_count ?? 0) - (a.sold_count ?? 0),
  rating: (a, b) => (b.rating ?? 0) - (a.rating ?? 0),
  discount: (a, b) => discount(b) - discount(a),
  price_asc: (a, b) => price(a) - price(b),
  price_desc: (a, b) => price(b) - price(a),
}
const COLLECTIONS: Record<string, (p: Product) => boolean> = {
  hot: (p) => (p.sold_count ?? 0) > 900,
  new: (p) => p.badge === 'NEW FIND' || p.badge === 'HIDDEN GEM',
  'gift-ready': (p) => p.badge === 'GIFT READY' || p.category === 'qua-tang',
  sale: (p) => discount(p) > 0,
  personal: (p) => !!p.engravable,
}
const fold = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase()

const find = (slug: string) => mockProducts.find((x) => x.slug === slug || x.id === slug)

const notFound = (message: string) => HttpResponse.json({ code: 'not_found', message }, { status: 404 })

/** Handlers for the Storefront API, mounted under any base URL. */
export function createHandlers(base: string) {
  return [
    http.get(`${base}/config`, () => HttpResponse.json(mockConfig())),

    http.get(`${base}/products`, ({ request }) => {
      const q = new URL(request.url).searchParams
      const text = q.get('q') ? fold(q.get('q')!) : null
      const coll = q.get('coll')
      const min = Number(q.get('price_min') ?? 0)
      const max = Number(q.get('price_max') ?? Infinity)
      let items = mockProducts.filter(
        (p) =>
          (!q.get('cat') || p.category === q.get('cat')) &&
          (!coll || COLLECTIONS[coll]?.(p)) &&
          (!q.get('badge') || p.badge === q.get('badge')) &&
          (!q.get('rec') || !!p.recipients?.includes(q.get('rec')!)) &&
          (!q.get('occ') || !!p.occasions?.includes(q.get('occ')!)) &&
          (q.get('in_stock') !== 'true' || p.variants.some((v) => v.stock > 0)) &&
          price(p) >= min &&
          price(p) < max &&
          (!text || fold(`${p.name} ${p.name_en ?? ''} ${p.description ?? ''}`).includes(text)),
      )
      items = [...items].sort(SORTS[q.get('sort') ?? 'popular'] ?? SORTS.popular)
      const limit = Math.min(60, Math.max(1, Number(q.get('limit') ?? 24)))
      const offset = Number(q.get('cursor') ?? 0)
      const page = items.slice(offset, offset + limit)
      const next = offset + limit < items.length ? String(offset + limit) : undefined
      return HttpResponse.json({ items: page, total: items.length, next_cursor: next })
    }),

    http.get(`${base}/products/:slug/related`, ({ params }) => {
      const p = find(params.slug as string)
      if (!p) return notFound('Sản phẩm không tồn tại')
      const items = mockProducts
        .filter((x) => x.id !== p.id && (x.category === p.category || x.occasions?.some((o) => p.occasions?.includes(o))))
        .slice(0, 8)
      return HttpResponse.json({ items })
    }),

    http.get(`${base}/products/:slug/bundle`, ({ params }) => {
      const p = find(params.slug as string)
      if (!p) return notFound('Sản phẩm không tồn tại')
      const items = [p.id === 'sn-010' ? 'sn-006' : 'sn-010', p.id === 'sn-013' ? 'sn-002' : 'sn-013'].map(productById)
      return HttpResponse.json({ items })
    }),

    http.get(`${base}/products/:slug`, ({ params }) => {
      const p = find(params.slug as string)
      return p ? HttpResponse.json(p) : notFound('Sản phẩm không tồn tại')
    }),

    http.get(`${base}/collections/:slug`, ({ params }) => {
      const c = mockCollections.find((x) => x.slug === params.slug)
      return c ? HttpResponse.json(c) : notFound('Bộ sưu tập không tồn tại')
    }),
    http.get(`${base}/banners`, () => HttpResponse.json({ items: mockBanners() })),
    http.get(`${base}/stories`, () => HttpResponse.json({ items: mockStories() })),
    http.get(`${base}/vouchers`, () => HttpResponse.json({ items: mockVouchers })),
    http.get(`${base}/promotions/flash`, () => HttpResponse.json({ sale: mockFlashSale() })),
    http.get(`${base}/geo/provinces`, () => HttpResponse.json({ items: mockProvinces })),

    http.get(`${base}/search/suggest`, ({ request }) => {
      const text = fold(new URL(request.url).searchParams.get('q') ?? '').trim()
      if (!text) return HttpResponse.json({ items: [] })
      const items = mockProducts
        .filter((p) => fold(`${p.name} ${p.name_en ?? ''} ${p.description ?? ''}`).includes(text))
        .sort(SORTS.popular)
        .slice(0, 5)
        .map((p) => ({ slug: p.slug, name: p.name, price: price(p), image: p.variants[0].images[0] }))
      return HttpResponse.json({ items })
    }),

    http.get(`${base}/inventory`, ({ request }) => {
      const skus = (new URL(request.url).searchParams.get('skus') ?? '').split(',').filter(Boolean)
      const all = mockProducts.flatMap((p) => p.variants)
      return HttpResponse.json({
        items: skus.flatMap((sku) => {
          const v = all.find((x) => x.sku === sku)
          return v ? [{ sku, stock: v.stock }] : []
        }),
      })
    }),
  ]
}
