'use client'

import Image from 'next/image'
import Link from 'next/link'
import { toast } from '@/components/ui/toast'
import { formatVnd } from '@/lib/format'
import { cartStore } from '@/lib/shopper'
import { useProducts } from '@/lib/use-products'

/** Interim cart page (Sprint 1). Sprint 2 replaces it with the server cart, drawer and checkout. */
export function CartList() {
  const lines = cartStore.use()
  const products = useProducts([...new Set(lines.map((l) => l.slug))])
  const find = (slug: string) => products.find((p) => p?.slug === slug)
  if (!lines.length)
    return (
      <div className="py-16 text-center">
        <h2 className="text-lg font-bold">Giỏ đang trống</h2>
        <p className="mt-2 mb-4 text-muted">Một món nhỏ có thể làm ngày vui hơn.</p>
        <Link href="/collection/hot" className="rounded-chip bg-plum px-6 py-[13px] font-semibold text-white">Xem đồ đang hot</Link>
      </div>
    )
  const subtotal = lines.reduce((s, l) => s + (find(l.slug)?.variants.find((v) => v.sku === l.sku)?.price ?? 0) * l.qty, 0)
  const setQty = (i: number, qty: number) => {
    const removed = lines[i]
    if (qty <= 0) {
      cartStore.set(lines.filter((_, j) => j !== i))
      toast(`Đã xóa ${find(removed.slug)?.name ?? 'món'} khỏi giỏ`)
    } else cartStore.set(lines.map((l, j) => (j === i ? { ...l, qty } : l)))
  }
  return (
    <>
      <ul>
        {lines.map((l, i) => {
          const p = find(l.slug)
          const v = p?.variants.find((x) => x.sku === l.sku)
          return (
            <li key={`${l.sku}-${l.engrave ?? ''}`} className="grid grid-cols-[76px_1fr_auto] gap-3 border-b border-line py-3.5">
              <div className="relative size-[76px] overflow-hidden rounded-[14px] bg-linen">{v ? <Image src={v.images[0]} alt="" fill sizes="76px" unoptimized className="object-cover" /> : null}</div>
              <div>
                <Link href={`/p/${l.slug}`} className="text-[13.5px] font-bold">{p?.name ?? '…'}</Link>
                <div className="text-xs text-muted">
                  {p && p.variants.length > 1 ? `Màu ${v?.name}` : ''}
                  {l.engrave ? ` · Khắc “${l.engrave}”` : ''}
                </div>
                <div className="mt-2 inline-flex items-center rounded-chip border-[1.5px] border-line bg-card">
                  <button type="button" className="size-9" onClick={() => setQty(i, l.qty - 1)} aria-label="Giảm">−</button>
                  <output className="min-w-6 text-center font-bold">{l.qty}</output>
                  <button type="button" className="size-9 disabled:opacity-40" disabled={!!v && l.qty >= v.stock} onClick={() => setQty(i, l.qty + 1)} aria-label="Tăng">+</button>
                </div>
              </div>
              <div className="text-right">
                <b className="text-[13.5px]">{v ? formatVnd(v.price * l.qty) : ''}</b>
                <br />
                <button type="button" className="mt-1 text-xs text-muted underline" onClick={() => setQty(i, 0)}>Xóa</button>
              </div>
            </li>
          )
        })}
      </ul>
      <div className="mt-4 flex justify-between text-[15px]">
        <span>Tạm tính</span>
        <b>{formatVnd(subtotal)}</b>
      </div>
      <p className="mt-1 text-xs text-muted">Phí giao hàng, mã giảm giá và gói quà được tính ở bước thanh toán.</p>
      <p className="mt-4 rounded-[20px] bg-linen p-4 text-sm">Thanh toán trực tuyến đang được hoàn thiện. Bạn vẫn có thể đặt qua Shopee, TikTok Shop hoặc Zalo OA của SENOVA.</p>
    </>
  )
}
