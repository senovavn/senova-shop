import Image from 'next/image'
import Link from 'next/link'
import { getBanners, getConfig, getFlashSale, getStories, getVouchers, listProducts } from '@/api/client'
import { ContextCards } from '@/components/home/ContextCards'
import { Finder } from '@/components/home/Finder'
import { FlashDeal } from '@/components/home/FlashDeal'
import { SuperHeader } from '@/components/home/SuperHeader'
import { VoucherWallet } from '@/components/home/VoucherWallet'
import { OpenUtilityLink } from '@/components/home/OpenUtilityLink'
import { ProductCard } from '@/components/product/ProductCard'
import { Carousel } from '@/components/ui/Carousel'
import { daysBetween, todayInVietnam } from '@/lib/date'

export const revalidate = 60

const sectionTitle = 'text-[clamp(26px,3.2vw,38px)] font-bold'
const wrap = 'mx-auto max-w-[1280px] px-4 sm:px-7'

export default async function HomePage() {
  const [config, banners, stories, vouchers, flash, hot, news] = await Promise.all([
    getConfig(),
    getBanners(),
    getStories(),
    getVouchers(),
    getFlashSale(),
    listProducts({ sort: 'popular', limit: 8 }),
    listProducts({ coll: 'new', sort: 'popular', limit: 8 }),
  ])
  const occ = config.next_occasion
  const days = occ ? daysBetween(todayInVietnam(), occ.date) : undefined

  return (
    <>
      <SuperHeader config={config} days={days} banners={banners} stories={stories} />
      <div className={wrap}>
        <section aria-labelledby="for-you" className="pt-10 pb-2.5">
          <h2 id="for-you" className="mb-3 text-2xl font-bold">Dành cho bạn</h2>
          <ContextCards freeShipThreshold={config.free_ship_threshold} voucherCount={vouchers.length} occasion={occ && days !== undefined ? { label: occ.label, days, hint: occ.hint } : undefined} />
        </section>

        <section aria-labelledby="wallet" className="py-2.5">
          <div className="mb-3 flex items-end justify-between">
            <h2 id="wallet" className="text-2xl font-bold">Kho voucher</h2>
            <OpenUtilityLink utility="voucher">Xem tất cả</OpenUtilityLink>
          </div>
          <VoucherWallet vouchers={vouchers} />
        </section>

        <section aria-labelledby="finder" className="pt-10">
          <h2 id="finder" className="mb-3 text-2xl font-bold">Tìm quà trong 3 chạm</h2>
          <Finder config={config} />
        </section>

        <section className="py-10">
          <Carousel
            label="Đang hot tuần này"
            heading={
              <div>
                <h2 className={sectionTitle}>Đang hot tuần này</h2>
                <p className="mt-1.5 text-muted">Xếp theo lượt bán 7 ngày qua</p>
              </div>
            }
          >
            {hot.map((p, i) => (
              <ProductCard key={p.id} product={p} rank={i + 1} />
            ))}
          </Carousel>
        </section>

        {flash ? (
          <div className="pb-10">
            <FlashDeal sale={flash} />
          </div>
        ) : null}

        {config.home_collections?.length ? (
          <section aria-label="Bộ sưu tập" className="pb-10">
            <ul className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-4">
              {config.home_collections.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/collection/${c.slug}`}
                    className="group relative flex min-h-40 flex-col justify-between overflow-hidden rounded-[26px] p-4 text-on-light transition-transform duration-[350ms] ease-senova hover:-translate-y-1 sm:min-h-[220px] sm:p-[22px]"
                    style={{ background: `var(--sn-${c.tone})` }}
                  >
                    <h3 className="relative z-[1] max-w-[60%] text-[17px] font-bold sm:text-[22px]">{c.title}</h3>
                    <span className="relative z-[1] text-[13.5px] font-semibold">Xem ngay ›</span>
                    <span className="absolute -right-5 -bottom-6 aspect-square w-[62%] transition-transform duration-500 ease-senova group-hover:scale-[1.06] group-hover:-rotate-6">
                      <Image src={c.image} alt="" fill sizes="200px" unoptimized className="object-contain" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {news.length ? (
          <section className="pb-10">
            <Carousel
              label="Món mới & Hidden Gems"
              heading={
                <div>
                  <h2 className={sectionTitle}>Món mới & Hidden Gems</h2>
                  <p className="mt-1.5 text-muted">Ít người biết, dùng là mê</p>
                </div>
              }
            >
              {news.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </Carousel>
          </section>
        ) : null}

        <section aria-labelledby="giftband" className="pb-10">
          <div className="grid items-center gap-8 overflow-hidden rounded-3xl bg-plum p-[22px] text-white sm:rounded-[34px] sm:p-[42px] lg:grid-cols-2">
            <div>
              <h2 id="giftband" className={`${sectionTitle} text-white`}>Tặng quà dễ hơn một chút.</h2>
              <p className="mt-3 max-w-[46ch] opacity-90">
                Chọn dịp tặng, SENOVA đổi đai hộp cho hợp, kèm thiệp viết tay và ẩn giá khi giao thẳng tới người nhận. Khắc tên miễn phí cho dây chuyền, ví thẻ và khung ảnh.
              </p>
              <ul className="mt-[18px] flex flex-wrap gap-2">
                {(config.gift_wrap_occasions ?? []).map((o, i) => (
                  <li key={o} className="rounded-chip px-3.5 py-2 text-[13px] font-semibold text-on-light" style={{ background: `var(--sn-${['lilac', 'sage', 'linen', 'mist', 'sunbeam'][i % 5]})` }}>
                    {o}
                  </li>
                ))}
              </ul>
              <OpenUtilityLink utility="wrap" className="mt-[22px] inline-flex rounded-chip bg-sunbeam px-6 py-[13px] font-semibold text-on-light">
                Chọn đai cho đơn tới
              </OpenUtilityLink>
            </div>
            {config.gift_wrap_image ? (
              <div className="relative aspect-square w-full max-w-[420px] justify-self-center overflow-hidden rounded-[28px]">
                <Image src={config.gift_wrap_image} alt="Hộp quà SENOVA với đai và thiệp" fill sizes="420px" unoptimized className="object-cover" />
              </div>
            ) : null}
          </div>
        </section>

        {config.trust?.length ? (
          <section aria-label="Cam kết" className="pb-4">
            <ul className="grid grid-cols-2 gap-3.5 lg:grid-cols-4">
              {config.trust.map((t) => (
                <li key={t.title} className="rounded-[20px] border border-line bg-card p-[18px]">
                  <b className="mb-0.5 block font-display text-base">{t.title}</b>
                  <span className="text-[13.5px] text-muted">{t.body}</span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </>
  )
}
