'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useState } from 'react'
import type { components } from '@/api/schema'
import { Sheet } from '@/components/ui/Sheet'
import { formatVnd } from '@/lib/format'
import { defaultVariant } from '@/lib/product'
import { useUiEvent } from '@/lib/ui-events'
import { Badge } from './Badge'
import { quickAdd } from './CardActions'
import { CheckIcon } from './CheckIcon'

type Product = components['schemas']['Product']

export function QuickView({ initial = null }: { initial?: Product | null }) {
  const [p, setP] = useState<Product | null>(initial)
  useUiEvent('quickview', useCallback((x: Product) => setP(x), []))
  const close = () => setP(null)
  const v = p ? defaultVariant(p) : null
  return (
    <Sheet open={!!p} onClose={close} label={p ? `Xem nhanh: ${p.name}` : 'Xem nhanh'} wide>
      {p && v ? (
        <div className="grid items-start gap-6 sm:grid-cols-2">
          <div className="relative aspect-square overflow-hidden rounded-[22px] bg-linen">
            <Image src={v.images[0]} alt={p.name} fill sizes="(min-width:640px) 420px, 90vw" unoptimized className="object-cover" />
          </div>
          <div>
            {p.badge ? <Badge code={p.badge} /> : null}
            <h2 className="mt-2.5 text-[clamp(26px,3.2vw,38px)] font-bold">{p.name}</h2>
            <p className="my-2.5 flex items-baseline gap-2">
              <span className="font-display text-2xl font-bold text-plum dark:text-sunbeam">{formatVnd(v.price)}</span>
              {v.compare_at ? <s className="text-muted">{formatVnd(v.compare_at)}</s> : null}
            </p>
            <ul className="mt-4">
              {p.highlights?.map((h) => (
                <li key={h} className="flex gap-2.5 py-[5px]">
                  <CheckIcon />
                  {h}
                </li>
              ))}
            </ul>
            <div className="mt-[18px] flex flex-wrap gap-2.5">
              <button type="button" className="rounded-chip bg-plum px-6 py-[13px] font-semibold text-white hover:bg-plum-deep" onClick={() => { quickAdd(p); close() }}>
                Thêm vào giỏ
              </button>
              <Link href={`/p/${p.slug}`} onClick={close} className="rounded-chip px-6 py-[13px] font-semibold shadow-[inset_0_0_0_1.5px_var(--sn-ink)] hover:bg-linen">
                Xem chi tiết
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </Sheet>
  )
}
