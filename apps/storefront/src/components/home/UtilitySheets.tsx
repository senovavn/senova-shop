'use client'

import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useState, type ReactNode } from 'react'
import type { StorefrontConfig } from '@/api/client'
import { quickAdd } from '@/components/product/CardActions'
import { Sheet } from '@/components/ui/Sheet'
import { toast } from '@/components/ui/toast'
import { daysBetween, todayInVietnam } from '@/lib/date'
import { deliveryEta } from '@/lib/eta'
import { formatVnd } from '@/lib/format'
import { defaultVariant } from '@/lib/product'
import { cartStore, giftWrapStore, provinceStore } from '@/lib/shopper'
import { sfGet, type S } from '@/lib/sf'
import { useUiEvent, type UtilityKey } from '@/lib/ui-events'
import { useProducts } from '@/lib/use-products'
import { Countdown } from './Countdown'
import { Finder } from './Finder'
import { UtilityIcon, utilityGradient } from './utility-icons'
import { VoucherWallet } from './VoucherWallet'

const primary = 'inline-flex w-full items-center justify-center rounded-chip px-6 py-[13px] font-semibold'

/** Hosts the ActionSheet for every utility tile; opened from anywhere via openUtility(key). */
export function UtilitySheets({ config, initial = null }: { config: StorefrontConfig; initial?: UtilityKey | null }) {
  const [open, setOpen] = useState<UtilityKey | null>(initial)
  useUiEvent('utility', useCallback((k: UtilityKey) => setOpen(k), []))
  const close = () => setOpen(null)
  const u = config.utilities.find((x) => x.key === open)
  return (
    <Sheet open={!!open && !!u?.enabled} onClose={close} label={u?.label ?? ''}>
      {open ? <SheetBody k={open} config={config} close={close} /> : null}
    </Sheet>
  )
}

function Head({ k, title, sub }: { k: UtilityKey; title: string; sub: string }) {
  return (
    <div className="mb-3.5 flex items-center gap-3.5 pr-10">
      <span className="grid size-[58px] flex-none place-items-center rounded-[18px]" style={{ background: utilityGradient(k) }}>
        <UtilityIcon k={k} className="size-7" />
      </span>
      <div>
        <h2 className="text-[21px] font-bold">{title}</h2>
        <p className="text-[13.5px] text-muted">{sub}</p>
      </div>
    </div>
  )
}

function MiniProduct({ p, action }: { p: S['Product']; action?: ReactNode }) {
  const v = defaultVariant(p)
  return (
    <li className="flex items-center gap-3 border-b border-line py-2.5">
      <Link href={`/p/${p.slug}`} className="relative size-[58px] flex-none overflow-hidden rounded-[14px] bg-linen" aria-label={p.name}>
        <Image src={v.images[0]} alt="" fill sizes="58px" unoptimized className="object-cover" />
      </Link>
      <div className="min-w-0">
        <b className="block truncate text-[13.5px]">{p.name}</b>
        <span className="text-[13.5px] font-bold text-plum dark:text-sunbeam">{formatVnd(v.price)}</span>
        {v.compare_at ? <s className="ml-1.5 text-[13px] text-muted">{formatVnd(v.compare_at)}</s> : null}
      </div>
      <div className="ml-auto flex-none">
        {action ?? (
          <button type="button" className="rounded-chip bg-plum px-3.5 py-2 text-[13px] font-semibold text-white" onClick={() => quickAdd(p)}>
            + Giỏ
          </button>
        )}
      </div>
    </li>
  )
}

function useProductList(query: Record<string, string | number | undefined>, enabled = true) {
  return useQuery({ queryKey: ['products', query], queryFn: () => sfGet<S['ProductPage']>('products', query), enabled }).data?.items
}

function List({ items, action }: { items?: S['Product'][]; action?: (p: S['Product']) => ReactNode }) {
  if (!items) return <p className="py-6 text-center text-sm text-muted">Đang tải…</p>
  return <ul>{items.map((p) => <MiniProduct key={p.id} p={p} action={action?.(p)} />)}</ul>
}

function SheetBody({ k, config, close }: { k: UtilityKey; config: StorefrontConfig; close: () => void }) {
  switch (k) {
    case 'event':
      return <EventSheet config={config} close={close} />
    case 'flash':
      return <FlashSheet close={close} />
    case 'voucher':
      return (
        <>
          <Head k="voucher" title="Kho voucher" sub="Lưu mã, SENOVA đề xuất khi thanh toán" />
          <VoucherList onUse={close} />
        </>
      )
    case 'freeship':
      return <FreeshipSheet threshold={config.free_ship_threshold} close={close} />
    case 'engrave':
      return <EngraveSheet config={config} close={close} />
    case 'express':
      return <ExpressSheet config={config} />
    case 'wrap':
      return <WrapSheet config={config} close={close} />
    case 'finder':
      return (
        <>
          <Head k="finder" title="Tìm quà trong 3 chạm" sub="Chọn người nhận, dịp và ngân sách" />
          <Finder config={config} compact onNavigate={close} />
        </>
      )
    case 'track':
      return (
        <>
          <Head k="track" title="Theo dõi đơn" sub="Đơn đặt trên trình duyệt này sẽ hiện ở đây" />
          <p className="mb-4 text-sm text-muted">Bạn chưa có đơn nào trên thiết bị này.</p>
          <Link href="/track" onClick={close} className={`${primary} shadow-[inset_0_0_0_1.5px_var(--sn-ink)]`}>
            Tra cứu bằng mã đơn
          </Link>
        </>
      )
    case 'chat':
      return null
  }
}

function EventSheet({ config, close }: { config: StorefrontConfig; close: () => void }) {
  const occ = config.next_occasion
  const items = useProductList({ rec: occ?.recipient, sort: 'popular', limit: 5 }, !!occ)
  if (!occ) return null
  const days = daysBetween(todayInVietnam(), occ.date)
  const cities = config.shipping?.express.provinces.join(', ')
  return (
    <>
      <Head k="event" title={`Còn ${days} ngày tới ${occ.label}`} sub={`${occ.name ?? occ.label}: ${occ.hint ?? ''}`} />
      <div className="mb-1.5 rounded-[20px] bg-linen p-4">
        <b className="text-[13.5px]">⏰ Đặt trước ngày {occ.label} ít nhất 2 ngày để chắc chắn kịp giao</b>
        {cities ? <p className="text-xs text-muted">Hỏa tốc 2 giờ vẫn kịp nếu bạn ở {cities}.</p> : null}
      </div>
      <List items={items} />
      <Link href={`/finder?rec=${occ.recipient ?? ''}`} onClick={close} className={`${primary} mt-3.5 bg-sunbeam text-on-light`}>
        Xem tất cả quà {occ.label}
      </Link>
    </>
  )
}

function FlashSheet({ close }: { close: () => void }) {
  const { data } = useQuery({ queryKey: ['flash'], queryFn: () => sfGet<{ sale: S['FlashSale'] | null }>('promotions/flash') })
  const sale = data?.sale
  return (
    <>
      <Head k="flash" title="Flash sale hôm nay" sub={sale ? 'Giá ưu đãi tới khi đồng hồ về 0' : 'Hiện chưa có chương trình'} />
      {sale ? (
        <>
          <div className="mb-2 flex items-center gap-2 text-sm">
            Kết thúc sau <Countdown endsAt={sale.ends_at} size="sm" />
          </div>
          <List items={sale.items.map((i) => i.product)} />
          <Link href="/collection/sale" onClick={close} className={`${primary} mt-3.5 bg-sunbeam text-on-light`}>
            Xem tất cả món đang giảm
          </Link>
        </>
      ) : (
        <Link href="/collection/sale" onClick={close} className={`${primary} bg-plum text-white`}>
          Xem món đang ưu đãi
        </Link>
      )}
    </>
  )
}

function VoucherList({ onUse }: { onUse: () => void }) {
  const { data } = useQuery({ queryKey: ['vouchers'], queryFn: () => sfGet<{ items: S['Voucher'][] }>('vouchers') })
  return data ? <VoucherWallet vouchers={data.items} layout="stack" onUse={onUse} /> : <p className="text-sm text-muted">Đang tải…</p>
}

function useCartSubtotal() {
  const cart = cartStore.use()
  const products = useProducts([...new Set(cart.map((l) => l.slug))])
  return cart.reduce((sum, l) => sum + (products.find((p) => p?.slug === l.slug)?.variants.find((v) => v.sku === l.sku)?.price ?? 0) * l.qty, 0)
}

function FreeshipSheet({ threshold, close }: { threshold: number; close: () => void }) {
  const sub = useCartSubtotal()
  const left = Math.max(0, threshold - sub)
  const items = useProductList({ price_min: Math.round(left * 0.6), sort: 'price_asc', limit: 4 }, left > 0)
  return (
    <>
      <Head k="freeship" title={left ? `Còn ${formatVnd(left)} để freeship` : 'Đơn của bạn đã đủ freeship 🎉'} sub={`Freeship đơn từ ${formatVnd(threshold)} với giao tiêu chuẩn`} />
      <div className="h-2.5 overflow-hidden rounded-full bg-linen" role="progressbar" aria-valuemin={0} aria-valuemax={threshold} aria-valuenow={Math.min(sub, threshold)} aria-label="Tiến độ freeship">
        <span className="block h-full origin-left bg-[linear-gradient(90deg,var(--sn-sage),var(--sn-sunbeam))] transition-transform duration-[600ms] ease-senova" style={{ transform: `scaleX(${Math.min(1, sub / threshold)})` }} />
      </div>
      <p className="mt-1.5 mb-2.5 text-xs text-muted">Giỏ hiện có {formatVnd(sub)} (tạm tính)</p>
      {left ? (
        <List items={items} />
      ) : (
        <Link href="/cart" onClick={close} className={`${primary} bg-plum text-white`}>
          Xem giỏ hàng
        </Link>
      )}
    </>
  )
}

function EngraveSheet({ config, close }: { config: StorefrontConfig; close: () => void }) {
  const items = useProductList({ coll: 'personal', limit: 12 })
  const e = config.engrave
  return (
    <>
      <Head k="engrave" title="Khắc tên miễn phí" sub={`Tối đa ${e?.max_length ?? 8} ký tự, thêm ${e?.extra_days ?? 1} ngày xử lý`} />
      <List
        items={items}
        action={(p) => (
          <Link href={`/p/${p.slug}#khac-chu`} onClick={close} className="rounded-chip bg-plum px-3.5 py-2 text-[13px] font-semibold text-white">
            Khắc ngay
          </Link>
        )}
      />
    </>
  )
}

function ExpressSheet({ config }: { config: StorefrontConfig }) {
  const province = provinceStore.use()
  const { data } = useQuery({ queryKey: ['provinces'], queryFn: () => sfGet<{ items: { code: string; name: string }[] }>('geo/provinces'), staleTime: Infinity })
  const items = useProductList({ sort: 'popular', limit: 4 })
  const shipping = config.shipping
  const eta = shipping ? deliveryEta(province, shipping) : null
  return (
    <>
      <Head k="express" title="Hỏa tốc 2 giờ" sub={`Nội thành ${shipping?.express.provinces.join(', ')}, đặt trước ${shipping?.express.cutoff}`} />
      <div className={`mb-2.5 rounded-[20px] p-4 ${eta?.express ? 'bg-sage/25' : 'bg-linen'}`}>
        <label className="flex flex-wrap items-center justify-between gap-2 text-[13.5px] font-bold">
          Giao tới
          <select
            value={province}
            onChange={(e) => provinceStore.set(e.target.value)}
            className="rounded-[14px] border-[1.5px] border-line bg-card px-2.5 py-1.5 text-[13px] font-normal"
          >
            {(data?.items ?? [{ code: '', name: province }]).map((p) => (
              <option key={p.name}>{p.name}</option>
            ))}
          </select>
        </label>
        <p className="mt-1.5 text-[13.5px]" aria-live="polite">
          {eta?.express
            ? `✓ Khu vực của bạn có hỏa tốc 2 giờ (${formatVnd(shipping!.express.fee)}).`
            : `Khu vực này giao tiêu chuẩn. Freeship đơn từ ${formatVnd(config.free_ship_threshold)}.`}
        </p>
        {eta ? <p className="mt-1 text-xs text-muted">{eta.text}</p> : null}
      </div>
      <List items={items} />
    </>
  )
}

function WrapSheet({ config, close }: { config: StorefrontConfig; close: () => void }) {
  const choice = giftWrapStore.use()
  return (
    <>
      <Head k="wrap" title="Gói quà miễn phí" sub="Hộp SENOVA, đai đổi màu theo dịp, thiệp viết tay" />
      {config.gift_wrap_image ? (
        <div className="relative mb-3 aspect-[4/3] overflow-hidden rounded-[20px] bg-linen">
          <Image src={config.gift_wrap_image} alt="Hộp quà SENOVA" fill sizes="520px" unoptimized className="object-cover" />
        </div>
      ) : null}
      <p className="mb-2 text-[13.5px] font-semibold">Chọn dịp tặng (đổi màu đai hộp):</p>
      <div className="flex flex-wrap gap-1.5">
        {(config.gift_wrap_occasions ?? []).map((o) => (
          <button
            key={o}
            type="button"
            aria-pressed={choice === o}
            onClick={() => {
              giftWrapStore.set(o)
              toast(`Đã chọn đai “${o}” cho đơn tới`)
            }}
            className={`rounded-chip border-[1.5px] px-[15px] py-[9px] text-sm font-medium ${choice === o ? 'border-plum bg-plum text-white' : 'border-line bg-card hover:border-plum'}`}
          >
            {o}
          </button>
        ))}
      </div>
      <p className="mt-2.5 text-xs text-muted">Lựa chọn được giữ đến bước thanh toán.</p>
      <Link href="/collection/gift-ready" onClick={close} className={`${primary} mt-3.5 bg-sunbeam text-on-light`}>
        Xem món gói sẵn để tặng
      </Link>
    </>
  )
}
