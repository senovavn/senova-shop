'use client'

import { cartCount, cartStore, wishlistStore } from '@/lib/shopper'

const pill = 'absolute top-0.5 right-0 grid h-[18px] min-w-[18px] place-items-center rounded-chip bg-sunbeam px-1 text-[11px] font-bold text-on-light'

export function CartCount() {
  const n = cartCount(cartStore.use())
  return n ? <span key={n} className={`${pill} sn-bump`}>{n}<span className="sr-only"> món</span></span> : null
}

export function WishCount() {
  const n = wishlistStore.use().length
  return n ? <span className={pill}>{n}<span className="sr-only"> món</span></span> : null
}
