'use client'

import { useEffect, useSyncExternalStore } from 'react'

type Toast = { id: number; text: string }
let current: Toast | null = null
let seq = 0
const listeners = new Set<() => void>()
const emit = () => listeners.forEach((l) => l())

export function toast(text: string) {
  current = { id: ++seq, text }
  emit()
}

/** Single polite live region; each new message replaces the previous one. */
export function Toaster() {
  const t = useSyncExternalStore(
    (l) => (listeners.add(l), () => listeners.delete(l)),
    () => current,
    () => null,
  )
  useEffect(() => {
    if (!t) return
    const timer = setTimeout(() => {
      if (current?.id === t.id) {
        current = null
        emit()
      }
    }, 3200)
    return () => clearTimeout(timer)
  }, [t])
  return (
    <div aria-live="polite" role="status" className="pointer-events-none fixed inset-x-0 bottom-[calc(84px+env(safe-area-inset-bottom,0px))] z-[95] flex justify-center px-4 sm:bottom-7">
      {t ? (
        <p key={t.id} className="sn-toast max-w-[92vw] rounded-chip bg-on-light px-[18px] py-3 text-sm text-white shadow-[0_12px_30px_color-mix(in_srgb,var(--sn-on-light)_25%,transparent)]">
          {t.text}
        </p>
      ) : null}
    </div>
  )
}
