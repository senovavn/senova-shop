import type { Metadata } from 'next'
import { CartList } from '@/components/cart/CartList'

export const metadata: Metadata = { title: 'Giỏ hàng', robots: { index: false } }

export default function CartPage() {
  return (
    <div className="mx-auto max-w-[760px] px-4 py-8 sm:px-7">
      <h1 className="mb-5 text-[clamp(28px,3.6vw,40px)] font-extrabold">Giỏ hàng</h1>
      <CartList />
    </div>
  )
}
