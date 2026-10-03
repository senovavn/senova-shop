import Image from 'next/image'
import Link from 'next/link'
import type { Product } from '@/api/client'
import { formatVnd } from '@/lib/format'
import { defaultVariant, discountPct } from '@/lib/product'
import { Badge, DiscountBadge } from './Badge'
import { CardActions, WishButton } from './CardActions'
import { Stars } from './Stars'

/** `eager`: above-the-fold card that may be the LCP element (Next 16 replaced `priority` with loading/fetchPriority). */
export function ProductCard({ product, rank, eager, tone = 'default' }: { product: Product; rank?: number; eager?: boolean; tone?: 'default' | 'onPlum' }) {
  const v = defaultVariant(product)
  const pct = discountPct(v)
  const sizes = '(min-width:1024px) 300px, (min-width:640px) 33vw, 46vw'
  return (
    <article className="group/card relative">
      <div className="relative isolate aspect-square overflow-hidden rounded-[18px] bg-linen sm:rounded-card">
        <Link href={`/p/${product.slug}`} className="absolute inset-0" aria-label={product.name}>
          <Image
            src={v.images[0]}
            alt=""
            fill
            sizes={sizes}
            unoptimized
            loading={eager ? 'eager' : 'lazy'}
            fetchPriority={eager ? 'high' : 'auto'}
            className="object-cover transition-transform duration-[600ms] ease-senova group-hover/card:scale-[1.04]"
          />
          {v.images[1] ? (
            <Image
              src={v.images[1]}
              alt=""
              fill
              sizes={sizes}
              unoptimized
              className="object-cover opacity-0 transition-opacity duration-[450ms] ease-senova group-hover/card:opacity-100"
            />
          ) : null}
        </Link>
        <div className="pointer-events-none absolute top-3 left-3 z-[2] max-w-[calc(100%-60px)]">
          {pct ? <DiscountBadge pct={pct} /> : product.badge ? <Badge code={product.badge} className="max-w-full overflow-hidden text-ellipsis text-[10px] sm:text-[11px]" /> : null}
        </div>
        <WishButton product={product} className="absolute top-2.5 right-2.5 z-[2]" />
        {rank ? (
          <span
            aria-hidden
            className="pointer-events-none absolute bottom-1 left-3 z-[3] font-display text-[56px] leading-none font-extrabold text-white [-webkit-text-stroke:2px_var(--sn-plum)] transition-opacity group-hover/card:opacity-0 sm:text-[76px]"
          >
            {rank}
          </span>
        ) : null}
        <CardActions product={product} />
      </div>
      <h3 className={`mt-3 text-sm leading-snug font-semibold sm:text-[15px] ${tone === 'onPlum' ? 'text-white' : ''}`}>
        <Link href={`/p/${product.slug}`}>
          {rank ? <span className="sr-only">Hạng {rank}: </span> : null}
          {product.name}
        </Link>
      </h3>
      <p className="mt-0.5 flex flex-wrap items-baseline gap-x-1.5">
        <span className={`font-bold ${tone === 'onPlum' ? 'text-sunbeam' : 'text-plum dark:text-sunbeam'}`}>{formatVnd(v.price)}</span>
        {v.compare_at ? (
          <s className={`text-[13px] ${tone === 'onPlum' ? 'text-white/75' : 'text-muted'}`}>
            <span className="sr-only">Giá gốc </span>
            {formatVnd(v.compare_at)}
          </s>
        ) : null}
      </p>
      <div className={tone === 'onPlum' ? '[&_*]:!text-white/85' : ''}>
        {product.rating ? <Stars rating={product.rating} /> : null}
        <span className={`text-[12.5px] ${tone === 'onPlum' ? 'text-white/85' : 'text-muted'}`}> · {(product.sold_count ?? 0).toLocaleString('vi-VN')} đã bán</span>
      </div>
      {product.variants.length > 1 ? (
        <ul className="mt-[7px] flex gap-1.5" aria-label="Màu có sẵn">
          {product.variants.map((x) => (
            <li key={x.sku} title={x.name} className="size-[15px] rounded-full shadow-[inset_0_0_0_1.5px_rgba(0,0,0,.12)]" style={{ background: x.hex }}>
              <span className="sr-only">{x.name}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  )
}
