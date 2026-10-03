import 'server-only'
import createClient from 'openapi-fetch'
import { apiEnv } from '@/lib/env'
import { createMockFetch } from '@/mocks/fetch'
import type { components, paths } from './schema'

type S = components['schemas']
export type Product = S['Product']
export type StorefrontConfig = S['Config']

export function createStorefrontClient(env = apiEnv()) {
  return createClient<paths>({
    baseUrl: env.base,
    headers: { 'X-Storefront-Host': env.host },
    fetch: env.mode === 'mock' ? createMockFetch(env.base) : undefined,
  })
}

let client: ReturnType<typeof createStorefrontClient> | undefined
export const api = () => (client ??= createStorefrontClient())
const header = () => ({ 'X-Storefront-Host': apiEnv().host })

function must<T>(label: string, r: { data?: T; error?: unknown }): T {
  if (r.data === undefined) throw new Error(`${label} failed: ${JSON.stringify(r.error)}`)
  return r.data
}

type ProductQuery = NonNullable<paths['/products']['get']['parameters']['query']>

export const getConfig = async () => must('GET /config', await api().GET('/config', { params: { header: header() } }))

export const listProductsPage = async (query: ProductQuery = {}) =>
  must('GET /products', await api().GET('/products', { params: { header: header(), query } }))

export const listProducts = async (query: ProductQuery = {}) => (await listProductsPage(query)).items

/** Returns null on 404 so pages can call notFound(). */
export async function getProduct(slug: string): Promise<Product | null> {
  const r = await api().GET('/products/{slug}', { params: { header: header(), path: { slug } } })
  if (r.response.status === 404) return null
  return must('GET /products/{slug}', r)
}

export const getRelated = async (slug: string) =>
  must('GET related', await api().GET('/products/{slug}/related', { params: { header: header(), path: { slug } } })).items

export const getBundle = async (slug: string) =>
  must('GET bundle', await api().GET('/products/{slug}/bundle', { params: { header: header(), path: { slug } } })).items

export const getBanners = async () => must('GET /banners', await api().GET('/banners', { params: { header: header() } })).items
export const getStories = async () => must('GET /stories', await api().GET('/stories', { params: { header: header() } })).items
export const getVouchers = async () => must('GET /vouchers', await api().GET('/vouchers', { params: { header: header() } })).items
export const getFlashSale = async () => must('GET /promotions/flash', await api().GET('/promotions/flash', { params: { header: header() } })).sale

export async function getCollection(slug: string) {
  const r = await api().GET('/collections/{slug}', { params: { header: header(), path: { slug } } })
  if (r.response.status === 404) return null
  return must('GET /collections/{slug}', r)
}
