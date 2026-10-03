import type { UtilityKey } from '@/lib/ui-events'

export type ContextCard = {
  id: 'cart' | 'payment' | 'shipping' | 'occasion' | 'wishlist' | 'voucher' | 'register'
  title: string
  sub: string
  cta: string
  action: { href: string } | { utility: UtilityKey } | { addProductId: string }
  primary?: boolean
  image?: string
  icon?: UtilityKey
}

export type ContextInput = {
  cart?: { items: number; subtotal: number; image?: string }
  freeShipThreshold: number
  pendingPayment?: { code: string; total: number; method: string }
  shipping?: { code: string; status: string; carrier: string }
  occasion?: { label: string; days: number; hint?: string }
  wishlistFirst?: { id: string; name: string; price: number; image?: string }
  hasSavedVouchers: boolean
  voucherCount: number
  signedIn: boolean
}

const vnd = (n: number) => `${Math.round(n).toLocaleString('vi-VN')}₫`

/**
 * "Dành cho bạn" cards in SPEC_UX priority order, max 6, one action each.
 * (Sprint 3 moves this to GET /me/context so app and Zalo can share it.)
 */
export function buildContextCards(s: ContextInput): ContextCard[] {
  const cards: ContextCard[] = []
  if (s.cart && s.cart.items > 0) {
    const left = s.freeShipThreshold - s.cart.subtotal
    cards.push({
      id: 'cart',
      title: `Còn ${s.cart.items} món trong giỏ`,
      sub: `Tạm tính ${vnd(s.cart.subtotal)}${left > 0 ? ` · thiếu ${vnd(left)} để freeship` : ' · đã đủ freeship'}`,
      cta: 'Xem giỏ',
      action: { href: '/cart' },
      primary: true,
      image: s.cart.image,
    })
  }
  if (s.pendingPayment)
    cards.push({ id: 'payment', title: `Đơn ${s.pendingPayment.code} chờ thanh toán`, sub: `${vnd(s.pendingPayment.total)} · ${s.pendingPayment.method}`, cta: 'Thanh toán', action: { href: `/order/${s.pendingPayment.code}` }, primary: true, icon: 'voucher' })
  if (s.shipping)
    cards.push({ id: 'shipping', title: `Đơn ${s.shipping.code}: ${s.shipping.status}`, sub: s.shipping.carrier, cta: 'Theo dõi', action: { href: `/order/${s.shipping.code}` }, icon: 'track' })
  if (s.occasion)
    cards.push({ id: 'occasion', title: `Còn ${s.occasion.days} ngày tới ${s.occasion.label}`, sub: s.occasion.hint ? `Gợi ý ${s.occasion.hint}` : 'Chọn quà sớm để kịp giao', cta: 'Chọn quà', action: { utility: 'event' }, primary: !cards.some((c) => c.primary), icon: 'event' })
  if (s.wishlistFirst)
    cards.push({ id: 'wishlist', title: 'Món bạn đã thích', sub: `${s.wishlistFirst.name} · ${vnd(s.wishlistFirst.price)}`, cta: '+ Giỏ', action: { addProductId: s.wishlistFirst.id }, image: s.wishlistFirst.image })
  if (!s.hasSavedVouchers && s.voucherCount > 0)
    cards.push({ id: 'voucher', title: `${s.voucherCount} mã giảm giá đang chờ bạn`, sub: 'Lưu mã, tự áp khi thanh toán', cta: 'Lưu mã', action: { utility: 'voucher' }, icon: 'voucher' })
  if (!s.signedIn)
    cards.push({ id: 'register', title: 'Tạo tài khoản SENOVA', sub: 'Lưu địa chỉ, theo dõi đơn, nhắc ngày đặc biệt', cta: 'Đăng ký', action: { href: '/account?tab=register' }, icon: 'chat' })
  return cards.slice(0, 6)
}
