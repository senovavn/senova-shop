'use client'

import { provinceStore } from '@/lib/shopper'
import { openUtility } from '@/lib/ui-events'

export function ProvinceButton() {
  const province = provinceStore.use()
  return (
    <button
      type="button"
      onClick={() => openUtility('express')}
      className="inline-flex items-center gap-1.5 rounded-chip border border-white/25 bg-white/15 px-3.5 py-2 text-[13px] text-white backdrop-blur-sm"
    >
      <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <path d="M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11z" />
        <circle cx="12" cy="10" r="2.5" />
      </svg>
      Giao tới: {province} ▾
    </button>
  )
}
