'use client'

import { useRouter } from 'next/navigation'
import type { components } from '@/api/schema'
import { toast } from '@/components/ui/toast'
import { cartStore, savedVouchersStore } from '@/lib/shopper'

type Voucher = components['schemas']['Voucher']

const STUB: Record<Voucher['kind'], string> = { percent: 'voucher', shipping: 'freeship', amount: 'event' }

/** Ticket stubs; "Lưu mã" saves to the wallet, then "Dùng ngay" carries it to checkout. */
export function VoucherWallet({ vouchers, layout = 'row', onUse }: { vouchers: Voucher[]; layout?: 'row' | 'stack'; onUse?: () => void }) {
  const saved = savedVouchersStore.use()
  const router = useRouter()
  return (
    <ul className={layout === 'row' ? 'grid auto-cols-[82%] grid-flow-col gap-3.5 overflow-x-auto pb-1.5 [scrollbar-width:none] sm:auto-cols-[minmax(270px,1fr)] [&::-webkit-scrollbar]:hidden' : 'grid gap-2.5'}>
      {vouchers.map((v) => {
        const isSaved = saved.includes(v.code)
        return (
          <li key={v.code} className="relative flex overflow-hidden rounded-[18px] border border-line bg-card">
            <span
              className="relative grid w-[92px] flex-none place-items-center p-2.5 text-center font-display text-xl leading-[1.1] font-extrabold text-white after:absolute after:inset-y-2 after:-right-px after:border-r-2 after:border-dashed after:border-white/60"
              style={{ background: `linear-gradient(145deg, var(--sn-util-${STUB[v.kind]}-from), var(--sn-util-${STUB[v.kind]}-to))` }}
            >
              {v.short}
            </span>
            <div className="flex flex-1 flex-col justify-center gap-1 px-3.5 py-3">
              <b className="text-[13.5px]">{v.code}</b>
              <span className="text-xs text-muted">{v.label}</span>
              <button
                type="button"
                className={`self-start rounded-chip px-3.5 py-[7px] text-[12.5px] font-semibold ${isSaved ? 'shadow-[inset_0_0_0_1.5px_var(--sn-ink)]' : 'bg-plum text-white'}`}
                onClick={() => {
                  if (!isSaved) {
                    savedVouchersStore.set((c) => [...c, v.code])
                    toast(`Đã lưu mã ${v.code} ✓`)
                    return
                  }
                  toast(`${v.code} sẽ được đề xuất khi thanh toán`)
                  onUse?.()
                  router.push(cartStore.get().length ? '/cart' : '/collection/hot')
                }}
              >
                {isSaved ? 'Dùng ngay' : 'Lưu mã'}
              </button>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
