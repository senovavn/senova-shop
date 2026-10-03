import Image from 'next/image'
import Link from 'next/link'
import type { Product } from '@/api/client'
import { formatVnd } from '@/lib/format'
import { t } from '@/i18n/t'

/** Minimal card for Sprint 0 (proves the data path). Full card with hover image, badges, wishlist lands in Sprint 1. */
/** `eager`: above-the-fold card that may be the LCP element (Next 16 replaced `priority` with loading/fetchPriority). */
export function ProductCard({ product, rank, eager }: { product: Product; rank?: number; eager?: boolean }) {
  const v = product.variants.find((x) => x.stock > 0) ?? product.variants[0]
  return (
    <article className="relative">
      <Link href={`/p/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden rounded-card bg-linen">
          <Image
            src={v.images[0]}
            alt={product.name}
            fill
            sizes="(min-width:1024px) 300px, (min-width:640px) 33vw, 50vw"
            unoptimized
            loading={eager ? 'eager' : 'lazy'}
            fetchPriority={eager ? 'high' : 'auto'}
            className="object-cover"
          />
          {rank ? (
            <span className="absolute bottom-1 left-3 font-display text-[56px] leading-none font-extrabold text-white [-webkit-text-stroke:2px_var(--sn-plum)] sm:text-[76px]" aria-label={`Hạng ${rank}`}>
              {rank}
            </span>
          ) : null}
        </div>
        <h3 className="mt-3 text-sm leading-snug font-semibold sm:text-[15px]">{product.name}</h3>
      </Link>
      <p className="mt-0.5 flex items-baseline gap-1.5">
        <span className="font-bold text-plum dark:text-sunbeam">{formatVnd(v.price)}</span>
        {v.compare_at ? <s className="text-[13px] text-muted">{formatVnd(v.compare_at)}</s> : null}
      </p>
      <p className="text-[12.5px] text-muted">{t('home.sold', { count: (product.sold_count ?? 0).toLocaleString('vi-VN') })}</p>
    </article>
  )
}
