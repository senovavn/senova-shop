import type { components } from '@/api/schema'
import type { StorefrontConfig } from '@/api/client'
import { SearchIcon } from '@/components/layout/icons'
import { BannerCarousel } from './BannerCarousel'
import { Greeting } from './Greeting'
import { ProvinceButton } from './ProvinceButton'
import { Stories } from './Stories'
import { UtilityGrid } from './UtilityGrid'

type S = components['schemas']

export function SuperHeader({ config, days, banners, stories }: { config: StorefrontConfig; days?: number; banners: S['Banner'][]; stories: S['Story'][] }) {
  const occ = config.next_occasion
  return (
    <section className="relative overflow-hidden rounded-b-[28px] bg-[radial-gradient(1200px_400px_at_85%_-10%,color-mix(in_srgb,var(--sn-plum)_80%,white)_0,transparent_60%),linear-gradient(135deg,var(--sn-plum-deep),var(--sn-plum)_45%,var(--sn-util-finder-from))] pt-[18px] pb-5 text-white after:pointer-events-none after:absolute after:inset-0 after:bg-[radial-gradient(circle_at_12%_120%,color-mix(in_srgb,var(--sn-sunbeam)_35%,transparent),transparent_40%)] sm:rounded-b-[40px] sm:pt-[26px] sm:pb-[30px]">
      <div className="relative z-[1] mx-auto max-w-[1280px] px-4 sm:px-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <Greeting />
            {occ && days !== undefined ? (
              <p className="mt-1 text-sm opacity-85">
                Hôm nay tặng ai? Còn <b>{days} ngày</b> tới {occ.label}.
              </p>
            ) : null}
          </div>
          <ProvinceButton />
        </div>
        <form action="/search" role="search" className="relative mt-3.5 sm:hidden">
          <SearchIcon className="pointer-events-none absolute top-3.5 left-3.5 size-5 text-muted" />
          <label htmlFor="home-q" className="sr-only">Tìm kiếm</label>
          <input id="home-q" name="q" type="search" placeholder="Tìm quà, charm, nến, hoa len…" className="h-12 w-full rounded-2xl bg-card pr-4 pl-11 text-ink shadow-[0_10px_30px_-14px_rgba(0,0,0,.5)] focus:outline-none" />
        </form>
        <div className="mt-[22px] grid gap-5 lg:grid-cols-[1.25fr_1fr] [&>*]:min-w-0">
          <BannerCarousel banners={banners} />
          <div className="order-first rounded-3xl bg-card px-2.5 py-4 text-ink shadow-[0_30px_60px_-30px_rgba(0,0,0,.55)] sm:order-none sm:rounded-[28px] sm:px-[18px] sm:py-5">
            <div className="mb-3 flex items-center justify-between px-1">
              <h2 className="font-display text-[17px] font-bold">Tiện ích SENOVA</h2>
              <span className="text-xs text-muted">Chạm để dùng</span>
            </div>
            <UtilityGrid utilities={config.utilities} daysToOccasion={days} occasionLabel={occ?.label} />
            <div className="mt-4 border-t border-line pt-3.5">
              <Stories stories={stories} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
