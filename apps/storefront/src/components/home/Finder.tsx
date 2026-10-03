'use client'

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { useState } from 'react'
import type { StorefrontConfig } from '@/api/client'
import { sfGet, type S } from '@/lib/sf'

type Choice = { rec?: string; occ?: string; budget?: string }

export function finderQuery(pick: Choice, budgets: NonNullable<StorefrontConfig['budgets']>) {
  const b = budgets.find((x) => x.key === pick.budget)
  return { rec: pick.rec, occ: pick.occ, price_min: b?.min, price_max: b?.max }
}

/** "Tìm quà trong 3 chạm": the count comes from the same /products query the result page runs. */
export function Finder({ config, compact, onNavigate }: { config: StorefrontConfig; compact?: boolean; onNavigate?: () => void }) {
  const [pick, setPick] = useState<Choice>({})
  const budgets = config.budgets ?? []
  const q = finderQuery(pick, budgets)
  const { data, isPlaceholderData, isFetching } = useQuery({
    queryKey: ['finder-count', q],
    queryFn: () => sfGet<S['ProductPage']>('products', { ...q, limit: 1 }),
    placeholderData: (prev) => prev,
  })
  const count = data?.total
  const groups: Array<[keyof Choice, string, S['Option'][]]> = [
    ['rec', '1. Tặng ai?', config.recipients ?? []],
    ['occ', '2. Dịp gì?', config.occasions ?? []],
    ['budget', '3. Ngân sách', budgets],
  ]
  const href = `/finder?${new URLSearchParams(Object.entries(pick).filter(([, v]) => v) as [string, string][])}`
  return (
    <div className={`grid gap-[22px] ${compact ? '' : 'items-end rounded-[28px] border border-line bg-card p-[26px] shadow-[0_24px_60px_-40px_rgba(62,28,55,.5)] lg:grid-cols-[repeat(3,1fr)_auto]'}`}>
      {groups.map(([key, title, options]) => (
        <fieldset key={key}>
          <legend className="mb-2.5 font-display text-base font-bold">{title}</legend>
          <div className="flex flex-wrap gap-[7px]">
            {options.map((o) => {
              const on = pick[key] === o.key
              return (
                <button
                  key={o.key}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setPick((p) => ({ ...p, [key]: on ? undefined : o.key }))}
                  className={`rounded-chip border-[1.5px] px-[15px] py-[9px] text-sm font-medium transition-[transform,background-color,border-color] ${on ? '-translate-y-px border-plum bg-plum text-white' : 'border-line bg-card hover:border-plum'}`}
                >
                  {o.label}
                </button>
              )
            })}
          </div>
        </fieldset>
      ))}
      <div className="text-center">
        <p className={`mb-2 text-[13.5px] text-muted transition-opacity ${isPlaceholderData ? 'opacity-50' : ''}`} aria-live="polite" aria-busy={isPlaceholderData || isFetching}>
          {count === undefined ? ' ' : `${count} món phù hợp`}
        </p>
        {count === 0 ? (
          <span className="inline-flex cursor-not-allowed rounded-chip bg-plum px-6 py-[13px] font-semibold text-white opacity-45">Xem gợi ý</span>
        ) : (
          <Link href={href} onClick={onNavigate} className="inline-flex rounded-chip bg-plum px-6 py-[13px] font-semibold text-white hover:bg-plum-deep">
            Xem gợi ý
          </Link>
        )}
      </div>
    </div>
  )
}
