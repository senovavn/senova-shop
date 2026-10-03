import { describe, expect, it } from 'vitest'
import { parseListing, withParams } from './listing'

const budgets = [
  { key: 'duoi-150k', label: 'Dưới 150K', min: 0, max: 150000 },
  { key: 'tren-300k', label: 'Trên 300K', min: 300000, max: 100000000 },
]

describe('parseListing', () => {
  it('defaults to best sellers, page 1', () => {
    expect(parseListing({}, budgets, { cat: 'qua-tang' })).toEqual({
      state: { sort: 'popular', budget: undefined, badge: undefined, stock: false, page: 1 },
      query: { cat: 'qua-tang', sort: 'popular', limit: 24 },
    })
  })
  it('maps budget, badge, stock and page into the API query', () => {
    const { query } = parseListing({ sort: 'price_asc', budget: 'duoi-150k', badge: 'NEW FIND', stock: '1', page: '2' }, budgets)
    expect(query).toEqual({ sort: 'price_asc', limit: 48, price_min: 0, price_max: 150000, badge: 'NEW FIND', in_stock: true })
  })
  it('ignores unknown sort and budget values', () => {
    expect(parseListing({ sort: 'evil', budget: 'x' }, budgets).query).toEqual({ sort: 'popular', limit: 24 })
  })
})

describe('withParams', () => {
  it('patches params and resets paging', () => {
    expect(withParams('/c/qua-tang', { sort: 'rating', page: '3' }, { badge: 'LIMITED' })).toBe('/c/qua-tang?sort=rating&badge=LIMITED')
    expect(withParams('/search', { q: 'ly', badge: 'LIMITED' }, { badge: undefined })).toBe('/search?q=ly')
  })
})
