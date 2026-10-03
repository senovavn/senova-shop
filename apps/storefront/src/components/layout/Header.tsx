import Link from 'next/link'
import type { StorefrontConfig } from '@/api/client'
import { Logo } from '@/components/brand/Logo'
import { t } from '@/i18n/t'
import { HeaderShell } from './HeaderShell'
import { MenuButton } from './MobileMenu'
import { BagIcon, HeartIcon, SearchIcon, UserIcon } from './icons'

const iconBtn = 'relative grid size-10 place-items-center rounded-chip transition-colors hover:bg-linen'

export function Header({ nav }: { nav: StorefrontConfig['nav'] }) {
  return (
    <HeaderShell>
      <div className="mx-auto flex h-[60px] max-w-[1280px] items-center gap-2 px-4 sm:h-[72px] sm:gap-[18px] sm:px-7">
        <MenuButton className={`${iconBtn} lg:hidden`} />
        <Link href="/" aria-label={t('header.home')} className="w-[104px] flex-none text-plum sm:w-[124px] dark:text-white">
          <Logo uid="header" className="w-full origin-left transition-transform duration-300 ease-senova group-data-[scrolled=true]:scale-90" />
        </Link>
        <nav aria-label={t('header.menu')} className="ml-1.5 hidden gap-0.5 lg:flex">
          {nav.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-chip px-[13px] py-[9px] text-[14.5px] transition-colors hover:bg-linen ${l.highlight ? 'font-bold text-plum dark:text-sunbeam' : 'font-medium'}`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <form action="/search" role="search" className="relative ml-auto hidden max-w-[330px] flex-1 sm:block">
          <SearchIcon className="pointer-events-none absolute top-3 left-3.5 size-[19px] text-muted" />
          <label htmlFor="header-q" className="sr-only">{t('header.search')}</label>
          <input
            id="header-q"
            name="q"
            type="search"
            autoComplete="off"
            placeholder={t('header.searchPlaceholder')}
            className="h-11 w-full rounded-chip border-[1.5px] border-line bg-card pr-4 pl-[42px] transition-[border-color,box-shadow] focus:border-plum focus:shadow-[0_0_0_4px_color-mix(in_srgb,var(--sn-plum)_12%,transparent)] focus:outline-none"
          />
        </form>
        <div className="ml-auto flex gap-0.5 sm:ml-0">
          <Link href="/account/wishlist" className={`${iconBtn} hidden sm:grid`} aria-label={t('header.wishlist')}>
            <HeartIcon className="size-[22px]" />
          </Link>
          <Link href="/account" className={`${iconBtn} hidden sm:grid`} aria-label={t('header.account')}>
            <UserIcon className="size-[22px]" />
          </Link>
          <Link href="/cart" className={iconBtn} aria-label={t('header.cart')}>
            <BagIcon className="size-[22px]" />
          </Link>
        </div>
      </div>
    </HeaderShell>
  )
}
