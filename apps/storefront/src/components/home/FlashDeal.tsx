'use client'

import { useState } from 'react'
import type { components } from '@/api/schema'
import { ProductCard } from '@/components/product/ProductCard'
import { Carousel } from '@/components/ui/Carousel'
import { Countdown } from './Countdown'

type Sale = components['schemas']['FlashSale']

/** Hidden when there is no sale, and disappears when the real end time passes. */
export function FlashDeal({ sale }: { sale: Sale | null }) {
  const [ended, setEnded] = useState(false)
  if (!sale || ended || !sale.items.length) return null
  return (
    <section aria-labelledby="flash-title" className="relative overflow-hidden rounded-3xl bg-[linear-gradient(120deg,var(--sn-plum),var(--sn-util-finder-from))] p-[22px] text-white sm:rounded-[30px] sm:p-7">
      <Carousel
        label="Flash deal"
        heading={
          <div className="flex flex-1 flex-wrap items-center justify-between gap-3">
            <div>
              <h2 id="flash-title" className="text-[clamp(26px,3.2vw,38px)] font-bold text-white">⚡ Flash deal hôm nay</h2>
              <p className="mt-1 opacity-85">Kết thúc sau</p>
            </div>
            <Countdown endsAt={sale.ends_at} onDone={() => setEnded(true)} />
          </div>
        }
      >
        {sale.items.map(({ product, claimed_pct }) => (
          <div key={product.id}>
            <ProductCard product={product} tone="onPlum" />
            <div className="mt-2 h-[7px] overflow-hidden rounded-full bg-white/25" role="progressbar" aria-valuenow={claimed_pct} aria-valuemin={0} aria-valuemax={100} aria-label="Suất ưu đãi đã bán">
              <span className="block h-full origin-left rounded-full bg-sunbeam" style={{ transform: `scaleX(${claimed_pct / 100})` }} />
            </div>
            <p className="mt-1 text-xs opacity-85">Đã bán {claimed_pct}% suất ưu đãi</p>
          </div>
        ))}
      </Carousel>
    </section>
  )
}
