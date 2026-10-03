'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { t } from '@/i18n/t'
import { openUtility } from '@/lib/ui-events'
import { CartCount } from './HeaderCounts'
import { openMenu } from './MobileMenu'
import { BagIcon, GiftIcon, GridIcon, HomeIcon, UserIcon } from './icons'

const item =
  'relative flex flex-col items-center gap-0.5 pt-2 pb-[7px] text-[11px] text-muted aria-[current=page]:text-plum dark:aria-[current=page]:text-sunbeam'

/** Phone-only (<640px) tab bar with the raised "Tìm quà" button in the middle. */
export function BottomNav() {
  const path = usePathname()
  const current = (match: boolean) => (match ? ('page' as const) : undefined)
  return (
    <nav
      aria-label="Điều hướng nhanh"
      className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-line bg-bg/95 pb-[env(safe-area-inset-bottom,0px)] backdrop-blur-md sm:hidden"
    >
      <Link href="/" className={item} aria-current={current(path === '/')}>
        <HomeIcon className="size-[22px]" />
        {t('bottomNav.home')}
      </Link>
      <button type="button" className={item} onClick={openMenu} aria-haspopup="dialog">
        <GridIcon className="size-[22px]" />
        {t('bottomNav.categories')}
      </button>
      <button type="button" className={`${item} -top-4`} onClick={() => openUtility('finder')} aria-haspopup="dialog">
        <span className="grid size-[54px] place-items-center rounded-full border-4 border-bg bg-[linear-gradient(135deg,var(--sn-util-flash-from),var(--sn-util-flash-to))] text-on-light shadow-[0_10px_22px_-8px_color-mix(in_srgb,var(--sn-util-flash-to)_80%,transparent)]">
          <GiftIcon className="size-[26px]" />
        </span>
        {t('bottomNav.finder')}
      </button>
      <Link href="/cart" className={item} aria-current={current(path.startsWith('/cart'))}>
        <BagIcon className="size-[22px]" />
        {t('bottomNav.cart')}
        <CartCount />
      </Link>
      <Link href="/account" className={item} aria-current={current(path.startsWith('/account'))}>
        <UserIcon className="size-[22px]" />
        {t('bottomNav.account')}
      </Link>
    </nav>
  )
}
