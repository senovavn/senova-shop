'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { CloseIcon } from '@/components/layout/icons'

/**
 * Bottom sheet on phones, centered panel from 640px. Native <dialog> gives focus trap,
 * Esc to close and inert background; backdrop click closes too.
 */
export function Sheet({ open, onClose, label, children, wide }: { open: boolean; onClose: () => void; label: string; children: ReactNode; wide?: boolean }) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (open && !d.open) d.showModal()
    if (!open && d.open) d.close()
  }, [open])
  return (
    <dialog
      ref={ref}
      aria-label={label}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      className={`sn-sheet m-0 mt-auto max-h-[85vh] w-full max-w-none overflow-y-auto rounded-t-sheet bg-bg px-[22px] pt-2.5 pb-[calc(24px+env(safe-area-inset-bottom,0px))] text-ink backdrop:bg-plum-deep/45 sm:m-auto sm:max-h-[88vh] sm:rounded-sheet sm:pt-6 ${wide ? 'sm:w-[min(900px,calc(100vw-32px))]' : 'sm:w-[min(560px,calc(100vw-32px))]'}`}
    >
      <div aria-hidden className="mx-auto mt-1 mb-3.5 h-[5px] w-11 rounded-full bg-line sm:hidden" />
      <button type="button" onClick={onClose} aria-label="Đóng" className="absolute top-3 right-3 grid size-10 place-items-center rounded-full hover:bg-linen">
        <CloseIcon className="size-5" />
      </button>
      {open ? children : null}
    </dialog>
  )
}
