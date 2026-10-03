'use client'

import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useState, type ReactNode } from 'react'
import type { components } from '@/api/schema'
import { WishButton } from '@/components/product/CardActions'
import { toast } from '@/components/ui/toast'
import { deliveryEta } from '@/lib/eta'
import { formatVnd } from '@/lib/format'
import { addToCart, provinceStore } from '@/lib/shopper'
import { sfGet } from '@/lib/sf'
import { Gallery } from './Gallery'

type S = components['schemas']
type Props = { product: S['Product']; config: S['Config']; header: ReactNode; details: ReactNode }

/** Gallery + buy box share the selected variant. Stock is re-read live from GET /inventory. */
export function ProductMain({ product, config, header, details }: Props) {
  const router = useRouter()
  const firstInStock = Math.max(0, product.variants.findIndex((v) => v.stock > 0))
  const [vi, setVi] = useState(firstInStock)
  const [qty, setQty] = useState(1)
  const [engrave, setEngrave] = useState('')
  const province = provinceStore.use()

  const skus = product.variants.map((v) => v.sku).join(',')
  const { data: live } = useQuery({
    queryKey: ['inventory', skus],
    queryFn: () => sfGet<{ items: { sku: string; stock: number }[] }>('inventory', { skus }),
    refetchInterval: 60_000,
  })
  const stockOf = (sku: string) => live?.items.find((x) => x.sku === sku)?.stock ?? product.variants.find((v) => v.sku === sku)!.stock
  const v = product.variants[vi]
  const stock = stockOf(v.sku)
  const maxLen = config.engrave?.max_length ?? 8
  const eta = config.shipping ? deliveryEta(province, config.shipping, new Date(), engrave.trim() ? (config.engrave?.extra_days ?? 1) : 0) : null
  const { data: provinces } = useQuery({ queryKey: ['provinces'], queryFn: () => sfGet<{ items: { name: string }[] }>('geo/provinces'), staleTime: Infinity })

  const add = (buy: boolean) => {
    if (stock <= 0) return toast('Màu này tạm hết hàng')
    const ok = addToCart({ sku: v.sku, productId: product.id, slug: product.slug, qty, engrave: product.engravable ? engrave : undefined }, stock)
    if (!ok) return toast(`Chỉ còn ${stock} món màu ${v.name}`)
    if (buy) router.push('/cart')
    else toast(`Đã thêm “${product.name}”`)
  }

  const btn = 'inline-flex flex-1 items-center justify-center rounded-chip px-6 py-[13px] font-semibold transition-transform active:scale-[.96] disabled:cursor-not-allowed disabled:opacity-45'
  return (
    <>
      <div className="grid gap-11 pt-5 pb-10 lg:grid-cols-[1.1fr_.9fr]">
        <div className="min-w-0">
          <Gallery key={v.sku} images={v.images} name={product.name} />
        </div>
        <div className="min-w-0">
          {header}
          <p className="mt-3.5 flex flex-wrap items-center gap-2.5">
            <span className="font-display text-[30px] font-bold text-plum dark:text-sunbeam">{formatVnd(v.price)}</span>
            {v.compare_at ? (
              <>
                <s className="text-[17px] text-muted"><span className="sr-only">Giá gốc </span>{formatVnd(v.compare_at)}</s>
                <span className="rounded-chip bg-sunbeam px-[11px] py-[5px] text-[11px] font-bold text-on-light">Tiết kiệm {formatVnd(v.compare_at - v.price)}</span>
              </>
            ) : null}
          </p>
          {details}

          {product.variants.length > 1 ? (
            <fieldset className="mt-[18px]">
              <legend className="text-[13.5px] font-bold">Màu: {v.name}</legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.variants.map((x, i) => {
                  const out = stockOf(x.sku) <= 0
                  return (
                    <button
                      key={x.sku}
                      type="button"
                      disabled={out}
                      aria-pressed={i === vi}
                      onClick={() => {
                        setVi(i)
                        setQty(1)
                      }}
                      className={`inline-flex items-center gap-2 rounded-chip border-[1.5px] bg-card py-[7px] pr-[15px] pl-2 transition-[border-color,box-shadow] disabled:cursor-not-allowed disabled:line-through disabled:opacity-45 ${i === vi ? 'border-plum shadow-[0_0_0_1px_var(--sn-plum)]' : 'border-line'}`}
                    >
                      <span className="size-6 rounded-full shadow-[inset_0_0_0_1.5px_rgba(0,0,0,.12)]" style={{ background: x.hex }} />
                      {x.name}
                      {out ? ' (hết)' : ''}
                    </button>
                  )
                })}
              </div>
            </fieldset>
          ) : null}

          {product.engravable ? (
            <div className="mt-3.5" id="khac-chu">
              <label htmlFor="engrave" className="mb-1.5 block text-[13px] font-semibold">Khắc chữ miễn phí (tối đa {maxLen} ký tự)</label>
              <input
                id="engrave"
                maxLength={maxLen}
                value={engrave}
                onChange={(e) => setEngrave(e.target.value)}
                placeholder="Ví dụ: Hà, M.K, 20.10"
                aria-describedby="engrave-preview"
                className="w-full rounded-[14px] border-[1.5px] border-line bg-card px-[15px] py-[13px] focus:border-plum focus:shadow-[0_0_0_4px_color-mix(in_srgb,var(--sn-plum)_12%,transparent)] focus:outline-none"
              />
              <p id="engrave-preview" className="mt-1.5 text-[13.5px] text-muted">
                Xem trước: <b className="font-display text-plum dark:text-sunbeam">{engrave || 'Xem trước'}</b> · Khắc thêm {config.engrave?.extra_days ?? 1} ngày xử lý
              </p>
            </div>
          ) : null}

          <div className="mt-[18px] flex flex-wrap items-center gap-2.5">
            <div className="inline-flex items-center rounded-chip border-[1.5px] border-line bg-card">
              <button type="button" className="size-[42px] text-lg disabled:opacity-40" onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty <= 1} aria-label="Giảm số lượng">−</button>
              <output className="min-w-7 text-center font-bold" aria-label="Số lượng">{qty}</output>
              <button type="button" className="size-[42px] text-lg disabled:opacity-40" onClick={() => setQty((q) => Math.min(stock, q + 1))} disabled={qty >= stock} aria-label="Tăng số lượng">+</button>
            </div>
            <span className={`text-[13.5px] ${stock > 0 && stock <= 5 ? 'font-semibold text-error' : ''}`} aria-live="polite">
              {stock > 0 ? (stock <= 5 ? `Chỉ còn ${stock} món` : 'Còn hàng') : 'Tạm hết màu này'}
            </span>
          </div>

          <div className="mt-4 flex gap-2.5">
            <button type="button" className={`${btn} bg-plum text-white hover:bg-plum-deep`} disabled={stock <= 0} onClick={() => add(false)}>Thêm vào giỏ</button>
            <button type="button" className={`${btn} bg-sunbeam text-on-light`} disabled={stock <= 0} onClick={() => add(true)}>Mua ngay</button>
            <WishButton product={product} className="!size-12 flex-none !bg-transparent shadow-[inset_0_0_0_1.5px_var(--sn-line)] !text-ink" />
          </div>

          {eta ? (
            <div className="mt-[18px] rounded-[20px] bg-linen p-4">
              <label className="flex flex-wrap items-center justify-between gap-2 text-[13.5px] font-bold">
                🚚 Giao tới
                <select value={province} onChange={(e) => provinceStore.set(e.target.value)} className="rounded-[14px] border-[1.5px] border-line bg-card px-2.5 py-1.5 text-[13px] font-normal">
                  {(provinces?.items ?? [{ name: province }]).map((p) => <option key={p.name}>{p.name}</option>)}
                </select>
              </label>
              <p className="mt-1.5 text-[13.5px]" aria-live="polite">{eta.text}</p>
            </div>
          ) : null}
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-[calc(60px+env(safe-area-inset-bottom,0px))] z-[39] flex items-center gap-2.5 border-t border-line bg-bg px-4 py-2.5 sm:hidden">
        <div className="min-w-0 flex-1">
          <div className="truncate text-[13.5px] text-muted">{product.name}</div>
          <b className="text-plum dark:text-sunbeam">{formatVnd(v.price)}</b>
        </div>
        <button type="button" className="rounded-chip bg-sunbeam px-4 py-3 font-semibold text-on-light disabled:opacity-45" disabled={stock <= 0} onClick={() => add(true)}>Mua ngay</button>
        <button type="button" className="rounded-chip bg-plum px-4 py-3 font-semibold text-white disabled:opacity-45" disabled={stock <= 0} onClick={() => add(false)}>Thêm</button>
      </div>
    </>
  )
}
