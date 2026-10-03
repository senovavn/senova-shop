import { beforeEach, describe, expect, it } from 'vitest'
import { addToCart, cartCount, cartStore, toggleWishlist, wishlistStore } from './shopper'

const line = { sku: 'SN-009-BAC', productId: 'sn-009', slug: 'day-chuyen', qty: 1 }

describe('cart', () => {
  beforeEach(() => {
    localStorage.clear()
    cartStore.reset()
  })

  it('merges the same SKU and engraving, keeps different engravings apart', () => {
    addToCart({ ...line, engrave: 'HA' }, 7)
    addToCart({ ...line, engrave: ' HA ' }, 7)
    addToCart({ ...line, engrave: 'MK' }, 7)
    expect(cartStore.get().map((l) => [l.engrave, l.qty])).toEqual([['HA', 2], ['MK', 1]])
    expect(cartCount(cartStore.get())).toBe(3)
  })

  it('refuses to exceed stock', () => {
    expect(addToCart({ ...line, qty: 2 }, 2)).toBe(true)
    expect(addToCart(line, 2)).toBe(false)
    expect(cartCount(cartStore.get())).toBe(2)
  })

  it('persists to localStorage', () => {
    addToCart(line, 5)
    expect(JSON.parse(localStorage.getItem('senova:cart')!)).toHaveLength(1)
  })
})

describe('wishlist', () => {
  it('toggles', () => {
    wishlistStore.reset()
    expect(toggleWishlist('sn-001')).toBe(true)
    expect(toggleWishlist('sn-001')).toBe(false)
    expect(wishlistStore.get()).toEqual([])
  })
})
