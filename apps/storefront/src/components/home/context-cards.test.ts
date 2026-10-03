import { describe, expect, it } from 'vitest'
import { buildContextCards, type ContextInput } from './context-cards'

const base: ContextInput = { freeShipThreshold: 299000, hasSavedVouchers: false, voucherCount: 3, signedIn: false }
const full: ContextInput = {
  ...base,
  cart: { items: 2, subtotal: 200000 },
  pendingPayment: { code: 'SN1', total: 300000, method: 'VietQR' },
  shipping: { code: 'SN2', status: 'Đang giao', carrier: 'GHN' },
  occasion: { label: '20/10', days: 16 },
  wishlistFirst: { id: 'sn-001', name: 'Ly', price: 289000 },
}

describe('buildContextCards', () => {
  it('follows SPEC_UX priority and caps at 6', () => {
    expect(buildContextCards(full).map((c) => c.id)).toEqual(['cart', 'payment', 'shipping', 'occasion', 'wishlist', 'voucher'])
  })
  it('shows how much is missing for free shipping', () => {
    expect(buildContextCards(full)[0].sub).toBe('Tạm tính 200.000₫ · thiếu 99.000₫ để freeship')
    expect(buildContextCards({ ...base, cart: { items: 1, subtotal: 300000 } })[0].sub).toContain('đã đủ freeship')
  })
  it('makes the occasion card primary when nothing urgent is pending', () => {
    const cards = buildContextCards({ ...base, occasion: { label: '20/10', days: 16 } })
    expect(cards.map((c) => c.id)).toEqual(['occasion', 'voucher', 'register'])
    expect(cards[0].primary).toBe(true)
  })
  it('drops voucher and register cards once done', () => {
    expect(buildContextCards({ ...base, hasSavedVouchers: true, signedIn: true })).toEqual([])
  })
})
