import { describe, expect, it } from 'vitest'
import { mockProducts } from './data'

const slugify = (s: string) =>
  s
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

describe('fixtures', () => {
  it('derive slugs from Vietnamese names, keeping đ as d', () => {
    for (const p of mockProducts) expect(p.slug, p.id).toBe(slugify(p.name))
  })
  it('have unique slugs and SKUs', () => {
    const slugs = mockProducts.map((p) => p.slug)
    const skus = mockProducts.flatMap((p) => p.variants.map((v) => v.sku))
    expect(new Set(slugs).size).toBe(slugs.length)
    expect(new Set(skus).size).toBe(skus.length)
  })
})
