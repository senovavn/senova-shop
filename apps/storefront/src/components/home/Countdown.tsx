'use client'

import { useEffect } from 'react'
import { useNow } from '@/lib/use-now'

export function remaining(endsAt: string, now: number) {
  let s = Math.max(0, Math.floor((Date.parse(endsAt) - now) / 1000))
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  s %= 60
  return { h, m, s, done: h + m + s === 0 }
}

const pad = (n: number) => String(n).padStart(2, '0')

/** Counts down to the sale's real `ends_at` (rule 8: no fake timers). */
export function Countdown({ endsAt, size = 'lg', onDone }: { endsAt: string; size?: 'lg' | 'sm'; onDone?: () => void }) {
  const now = useNow()
  const r = now === null ? null : remaining(endsAt, now)
  useEffect(() => {
    if (r?.done) onDone?.()
  }, [r?.done, onDone])
  const parts = r ? [r.h, r.m, r.s] : null
  const box =
    size === 'lg'
      ? 'min-w-[52px] rounded-xl bg-white px-1.5 py-2 text-center font-display text-2xl font-bold text-plum'
      : 'min-w-[30px] rounded-lg bg-plum px-1 py-0.5 text-center font-display text-sm font-bold text-white'
  return (
    <span className="inline-flex gap-1.5" role="timer" aria-label={r ? `Còn ${r.h} giờ ${r.m} phút` : 'Đang tính thời gian'}>
      {(parts ?? [null, null, null]).map((x, i) => (
        <b key={i} className={box} aria-hidden>
          {x === null ? '--' : pad(x)}
        </b>
      ))}
    </span>
  )
}
