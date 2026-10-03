'use client'

import Link from 'next/link'
import { useCallback, useRef } from 'react'
import type { StorefrontConfig } from '@/api/client'
import { t } from '@/i18n/t'
import { dispatchUi, useUiEvent } from '@/lib/ui-events'
import { CloseIcon, MenuIcon } from './icons'

export const openMenu = () => dispatchUi('menu', undefined)

export function MenuButton({ className }: { className?: string }) {
  return (
    <button type="button" className={className} onClick={openMenu} aria-label={t('header.menu')} aria-haspopup="dialog">
      <MenuIcon className="size-[22px]" />
    </button>
  )
}

/** Category menu for phone/tablet. Native <dialog>: focus trap, Esc and backdrop close come for free. */
export function MobileMenu({ nav }: { nav: StorefrontConfig['nav'] }) {
  const ref = useRef<HTMLDialogElement>(null)
  useUiEvent('menu', useCallback(() => ref.current?.showModal(), []))
  const close = () => ref.current?.close()
  return (
    <dialog
      ref={ref}
      aria-label={t('header.menu')}
      onClick={(e) => e.target === ref.current && close()}
      className="sn-sheet m-auto w-[min(520px,calc(100vw-32px))] rounded-sheet bg-bg p-6 text-ink backdrop:bg-plum-deep/45"
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold">{t('header.menu')}</h2>
        <button type="button" onClick={close} className="grid size-10 place-items-center rounded-chip hover:bg-linen" aria-label={t('header.close')}>
          <CloseIcon className="size-5" />
        </button>
      </div>
      <ul className="grid gap-2 sm:grid-cols-2">
        {nav.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              onClick={close}
              className={`block rounded-[18px] border-[1.5px] border-line px-4 py-3 font-semibold hover:border-plum ${l.highlight ? 'text-plum dark:text-sunbeam' : ''}`}
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </dialog>
  )
}
