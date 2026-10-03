import { describe, expect, it } from 'vitest'
import createClient from 'openapi-fetch'
import type { paths } from '@/api/schema'
import { createMockFetch } from './fetch'
import { nextOccasion } from './data'

const base = 'https://api.test/v1/storefront'
const client = createClient<paths>({ baseUrl: base, fetch: createMockFetch(base) })
const host = { 'X-Storefront-Host': 'senovagifts.com' }

describe('mock Storefront API', () => {
  it('serves config with marquee, nav and freeship threshold', async () => {
    const { data } = await client.GET('/config', { params: { header: host } })
    expect(data?.marquee.length).toBeGreaterThan(0)
    expect(data?.nav[0]).toMatchObject({ href: '/collection/hot', highlight: true })
    expect(data?.free_ship_threshold).toBe(299000)
  })

  it('sorts products by sales and honours limit', async () => {
    const { data } = await client.GET('/products', { params: { header: host, query: { sort: 'popular', limit: 3 } } })
    const sold = data!.items!.map((p) => p.sold_count!)
    expect(sold).toHaveLength(3)
    expect([...sold].sort((a, b) => b - a)).toEqual(sold)
    expect(data!.next_cursor).toBe('3')
  })

  it('searches without Vietnamese diacritics', async () => {
    const { data } = await client.GET('/products', { params: { header: host, query: { q: 'ly giu nhiet' } } })
    expect(data!.items!.map((p) => p.id)).toContain('sn-001')
  })

  it('maps fixture images to mock media URLs', async () => {
    const { data } = await client.GET('/products/{slug}', {
      params: { header: host, path: { slug: 'sn-001' } },
    })
    expect(data!.variants[0].images[0]).toBe('/mock-media/sn-001-sage-1.svg')
  })

  it('returns 404 for unknown products', async () => {
    const { response } = await client.GET('/products/{slug}', {
      params: { header: host, path: { slug: 'nope' } },
    })
    expect(response.status).toBe(404)
  })
})

describe('nextOccasion', () => {
  it('picks the nearest upcoming date and rolls over the year', () => {
    expect(nextOccasion('2026-10-04')).toMatchObject({ label: '20/10', date: '2026-10-20' })
    expect(nextOccasion('2026-10-20').label).toBe('20/10')
    expect(nextOccasion('2026-12-25')).toMatchObject({ label: '14/2', date: '2027-02-14' })
  })
})
