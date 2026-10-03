'use client'

import type { components } from '@/api/schema'
import { HeartIcon } from '@/components/layout/icons'
import { toast } from '@/components/ui/toast'
import { defaultVariant } from '@/lib/product'
import { addToCart, toggleWishlist, wishlistStore } from '@/lib/shopper'
import { openQuickView } from '@/lib/ui-events'

type Product = components['schemas']['Product']

export function WishButton({ product, className = '' }: { product: Product; className?: string }) {
  const on = wishlistStore.use().includes(product.id)
  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label={on ? `Bỏ ${product.name} khỏi yêu thích` : `Lưu ${product.name} vào yêu thích`}
      onClick={(e) => {
        e.preventDefault()
        toast(toggleWishlist(product.id) ? 'Đã lưu vào yêu thích ♡' : 'Đã bỏ khỏi yêu thích')
      }}
      className={`grid size-[38px] place-items-center rounded-full bg-white/90 text-on-light transition-transform active:scale-[.85] ${className}`}
    >
      <HeartIcon className={`size-[18px] ${on ? 'fill-heart stroke-heart' : ''}`} />
    </button>
  )
}

export function quickAdd(product: Product, qty = 1, engrave?: string, sku?: string) {
  const v = product.variants.find((x) => x.sku === sku) ?? defaultVariant(product)
  if (v.stock <= 0) return toast('Sản phẩm tạm hết hàng')
  const ok = addToCart({ sku: v.sku, productId: product.id, slug: product.slug, qty, engrave }, v.stock)
  toast(ok ? `Đã thêm “${product.name}”` : `Chỉ còn ${v.stock} món màu ${v.name}`)
}

const btn = 'inline-flex items-center justify-center rounded-chip px-3.5 py-2.5 text-[13.5px] font-semibold whitespace-nowrap transition-transform active:scale-[.96]'

/** Hover/focus actions on desktop cards. */
export function CardActions({ product }: { product: Product }) {
  return (
    <div className="absolute inset-x-3 bottom-3 z-[2] hidden translate-y-2.5 gap-2 opacity-0 transition-[opacity,transform] duration-300 ease-senova group-focus-within/card:translate-y-0 group-focus-within/card:opacity-100 group-hover/card:translate-y-0 group-hover/card:opacity-100 sm:flex">
      <button type="button" className={`${btn} flex-1 bg-plum text-white hover:bg-plum-deep`} onClick={() => quickAdd(product)}>
        Thêm vào giỏ
      </button>
      <button type="button" className={`${btn} bg-sunbeam text-on-light`} onClick={() => openQuickView(product)}>
        Xem nhanh
      </button>
    </div>
  )
}
