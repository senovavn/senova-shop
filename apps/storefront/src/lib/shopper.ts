'use client'

import { createLocalStore } from './local-store'

// Shopper state kept in the browser until the matching API lands:
// cart → POST /carts (Sprint 2), wishlist/vouchers → /me/* (Sprint 3).
export type CartLine = { sku: string; productId: string; slug: string; qty: number; engrave?: string }

export const cartStore = createLocalStore<CartLine[]>('senova:cart', [])
export const wishlistStore = createLocalStore<string[]>('senova:wishlist', [])
export const savedVouchersStore = createLocalStore<string[]>('senova:vouchers', [])
export const seenStoriesStore = createLocalStore<string[]>('senova:stories-seen', [])
export const provinceStore = createLocalStore<string>('senova:province', 'TP. Hồ Chí Minh')
export const giftWrapStore = createLocalStore<string | null>('senova:gift-wrap', null)

/** Adds to the cart, merging the same SKU + engraving. Returns false when stock would be exceeded. */
export function addToCart(line: CartLine, stock: number): boolean {
  const engrave = line.engrave?.trim() || undefined
  const current = cartStore.get()
  const existing = current.find((l) => l.sku === line.sku && (l.engrave ?? '') === (engrave ?? ''))
  if ((existing?.qty ?? 0) + line.qty > stock) return false
  cartStore.set(
    existing
      ? current.map((l) => (l === existing ? { ...l, qty: l.qty + line.qty } : l))
      : [...current, { ...line, engrave }],
  )
  return true
}

export const cartCount = (lines: CartLine[]) => lines.reduce((n, l) => n + l.qty, 0)

export function toggleWishlist(productId: string): boolean {
  const has = wishlistStore.get().includes(productId)
  wishlistStore.set((ids) => (has ? ids.filter((x) => x !== productId) : [...ids, productId]))
  return !has
}
