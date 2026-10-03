'use client'

import type { components } from '@/api/schema'
import { toast } from '@/components/ui/toast'
import { defaultVariant } from '@/lib/product'
import { addToCart } from '@/lib/shopper'

export function AddBundle({ products }: { products: components['schemas']['Product'][] }) {
  return (
    <button
      type="button"
      className="mt-2 rounded-chip bg-plum px-6 py-[13px] font-semibold text-white hover:bg-plum-deep"
      onClick={() => {
        const added = products.filter((p) => {
          const v = defaultVariant(p)
          return v.stock > 0 && addToCart({ sku: v.sku, productId: p.id, slug: p.slug, qty: 1 }, v.stock)
        })
        toast(added.length === products.length ? `Đã thêm ${added.length} món vào giỏ` : `Đã thêm ${added.length}/${products.length} món (có món tạm hết)`)
      }}
    >
      Thêm cả {products.length} vào giỏ
    </button>
  )
}
