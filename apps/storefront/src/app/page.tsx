import { getConfig, listProducts } from '@/api/client'
import { ProductCard } from '@/components/product/ProductCard'
import { t } from '@/i18n/t'
import { daysBetween, todayInVietnam } from '@/lib/date'

export const revalidate = 60

export default async function HomePage() {
  const [config, hot] = await Promise.all([getConfig(), listProducts({ sort: 'popular', limit: 8 })])
  const occasion = config.next_occasion
  return (
    <div className="mx-auto max-w-[1280px] px-4 sm:px-7">
      <section className="py-10 sm:py-14">
        <h1 className="text-[clamp(38px,6vw,76px)] font-extrabold">{config.brand.tagline}</h1>
        {occasion ? (
          <p className="mt-4 max-w-[40ch] text-lg text-muted">
            {t('home.countdown', { days: daysBetween(todayInVietnam(), occasion.date), occasion: occasion.label })}
            {occasion.hint ? ` · ${occasion.hint}` : ''}
          </p>
        ) : null}
      </section>
      <section aria-labelledby="hot-title" className="pb-10">
        <div className="mb-5">
          <h2 id="hot-title" className="text-[clamp(26px,3.2vw,38px)] font-bold">{t('home.hotTitle')}</h2>
          <p className="mt-1.5 text-muted">{t('home.hotSub')}</p>
        </div>
        <ol className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
          {hot.map((p, i) => (
            <li key={p.id}>
              <ProductCard product={p} rank={i + 1} eager={i < 2} />
            </li>
          ))}
        </ol>
      </section>
    </div>
  )
}
