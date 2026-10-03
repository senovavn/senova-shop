import 'server-only'
import createClient from 'openapi-fetch'
import { apiEnv } from '@/lib/env'
import { createMockFetch } from '@/mocks/fetch'
import type { components, paths } from './schema'

export type Product = components['schemas']['Product']
export type StorefrontConfig = components['schemas']['Config']

export function createStorefrontClient(env = apiEnv()) {
  return createClient<paths>({
    baseUrl: env.base,
    headers: { 'X-Storefront-Host': env.host },
    fetch: env.mode === 'mock' ? createMockFetch(env.base) : undefined,
  })
}

let client: ReturnType<typeof createStorefrontClient> | undefined
export const api = () => (client ??= createStorefrontClient())

export async function getConfig(): Promise<StorefrontConfig> {
  const { data, error } = await api().GET('/config', {
    params: { header: { 'X-Storefront-Host': apiEnv().host } },
  })
  if (!data) throw new Error(`GET /config failed: ${JSON.stringify(error)}`)
  return data
}

export async function listProducts(
  query: NonNullable<paths['/products']['get']['parameters']['query']> = {},
): Promise<Product[]> {
  const { data, error } = await api().GET('/products', {
    params: { header: { 'X-Storefront-Host': apiEnv().host }, query },
  })
  if (!data) throw new Error(`GET /products failed: ${JSON.stringify(error)}`)
  return data.items ?? []
}
