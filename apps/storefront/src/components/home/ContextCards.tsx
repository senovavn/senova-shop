'use client'

import Image from 'next/image'
import Link from 'next/link'
import { quickAdd } from '@/components/product/CardActions'
import { defaultVariant } from '@/lib/product'
import { cartCount, cartStore, savedVouchersStore, wishlistStore } from '@/lib/shopper'
import { useProducts } from '@/lib/use-products'
import { openUtility } from '@/lib/ui-events'
import { buildContextCards, type ContextCard } from './context-cards'
import { UtilityIcon, utilityGradient } from './utility-icons'

type Props = { freeShipThreshold: number; voucherCount: number; occasion?: { label: string; days: number; hint?: string } }

export function ContextCards({ freeShipThreshold, voucherCount, occasion }: Props) {
  const cart = cartStore.use()
  const wish = wishlistStore.use()
  const saved = savedVouchersStore.use()
  const products = useProducts([...new Set([...cart.map((l) => l.slug), ...wish.slice(0, 1)])])
  const bySlugOrId = (k: string) => products.find((p) => p && (p.slug === k || p.id === k))

  const cartProducts = cart.map((l) => ({ l, p: bySlugOrId(l.slug) }))
  const subtotal = cartProducts.reduce((sum, { l, p }) => sum + (p?.variants.find((v) => v.sku === l.sku)?.price ?? 0) * l.qty, 0)
  const wp = wish[0] ? bySlugOrId(wish[0]) : undefined

  const cards = buildContextCards({
    cart: cart.length ? { items: cartCount(cart), subtotal, image: cartProducts[0]?.p ? defaultVariant(cartProducts[0].p).images[0] : undefined } : undefined,
    freeShipThreshold,
    occasion,
    wishlistFirst: wp ? { id: wp.id, name: wp.name, price: defaultVariant(wp).price, image: defaultVariant(wp).images[0] } : undefined,
    hasSavedVouchers: saved.length > 0,
    voucherCount,
    signedIn: false,
  })

  return (
    <ul className="grid auto-cols-[86%] grid-flow-col gap-3.5 overflow-x-auto px-0.5 pt-1 pb-2.5 [scrollbar-width:none] sm:auto-cols-[minmax(300px,1fr)] [&::-webkit-scrollbar]:hidden">
      {cards.map((c) => (
        <li key={c.id} className="flex items-center gap-3.5 rounded-[22px] border border-line bg-card p-4 transition-transform hover:-translate-y-0.5">
          <span className="relative grid size-14 flex-none place-items-center overflow-hidden rounded-2xl" style={c.icon ? { background: utilityGradient(c.icon) } : undefined}>
            {c.image ? <Image src={c.image} alt="" fill sizes="56px" unoptimized className="object-cover" /> : c.icon ? <UtilityIcon k={c.icon} /> : null}
          </span>
          <div className="min-w-0">
            <b className="block text-[14.5px]">{c.title}</b>
            <span className="block truncate text-[12.5px] text-muted">{c.sub}</span>
          </div>
          <CardAction card={c} />
        </li>
      ))}
    </ul>
  )
}

function CardAction({ card }: { card: ContextCard }) {
  const cls = `ml-auto flex-none rounded-chip px-3.5 py-[9px] text-[13px] font-semibold ${card.primary ? 'bg-plum text-white hover:bg-plum-deep' : 'shadow-[inset_0_0_0_1.5px_var(--sn-ink)] hover:bg-linen'}`
  const a = card.action
  if ('href' in a) return <Link href={a.href} className={cls}>{card.cta}</Link>
  if ('utility' in a) return <button type="button" className={cls} onClick={() => openUtility(a.utility)}>{card.cta}</button>
  return <AddButton id={a.addProductId} className={cls} label={card.cta} />
}

function AddButton({ id, className, label }: { id: string; className: string; label: string }) {
  const [p] = useProducts([id])
  return (
    <button type="button" className={className} disabled={!p} onClick={() => p && quickAdd(p)}>
      {label}
    </button>
  )
}
