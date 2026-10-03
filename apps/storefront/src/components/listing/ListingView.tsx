import Link from 'next/link'
import { getConfig, listProductsPage } from '@/api/client'
import { OpenUtilityLink } from '@/components/home/OpenUtilityLink'
import { ProductCard } from '@/components/product/ProductCard'
import { PAGE_SIZE, parseListing, withParams, type ProductQuery, type SearchParams } from '@/lib/listing'
import { Filters, SortSelect } from './Filters'

type Props = {
  path: string
  title: string
  description?: string
  subtitle?: string
  base: ProductQuery
  searchParams: SearchParams
  /** Params that define the page (kept when filters change), e.g. q, rec, occ. */
  keep?: Record<string, string | undefined>
  category?: string
}

export async function ListingView({ path, title, description, subtitle, base, searchParams, keep = {}, category }: Props) {
  const config = await getConfig()
  const { state, query } = parseListing(searchParams, config.budgets ?? [], base)
  const page = await listProductsPage(query)
  const hidden = { ...keep, budget: state.budget, badge: state.badge, stock: state.stock ? '1' : undefined, sort: state.sort }
  const filtered = state.budget || state.badge || state.stock
  const filterProps = {
    action: path,
    hidden: keep,
    state,
    budgets: config.budgets ?? [],
    categories: config.categories ? { current: category, options: config.categories } : undefined,
    total: page.total,
  }
  return (
    <div className="mx-auto max-w-[1280px] px-4 sm:px-7">
      <nav aria-label="Breadcrumb" className="pt-5 text-[13px] text-muted">
        <ol className="flex flex-wrap gap-1">
          <li><Link href="/" className="underline underline-offset-2">Trang chủ</Link> /</li>
          <li aria-current="page">{title}</li>
        </ol>
      </nav>
      <div className="mt-2.5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[clamp(30px,4.4vw,50px)] font-extrabold">{title}</h1>
          {subtitle ? <p className="mt-1.5 text-muted">{subtitle}</p> : null}
          {description ? <p className="mt-1.5 max-w-[60ch] text-muted">{description}</p> : null}
        </div>
        <div className="flex items-center gap-2.5">
          <Filters {...filterProps} variant="button" />
          <SortSelect action={path} hidden={hidden} value={state.sort} />
        </div>
      </div>
      <div className="grid gap-[30px] pt-6 pb-10 lg:grid-cols-[250px_1fr]">
        <aside className="hidden lg:block">
          <Filters {...filterProps} variant="sidebar" />
        </aside>
        <div>
          {page.items.length ? (
            <>
              <h2 className="sr-only">Danh sách sản phẩm</h2>
              <p className="mb-3 text-[13.5px] text-muted" role="status">{page.total} sản phẩm</p>
              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 xl:grid-cols-4">
                {page.items.map((p, i) => (
                  <li key={p.id}><ProductCard product={p} eager={i < 2} /></li>
                ))}
              </ul>
              {page.items.length < page.total && state.page * PAGE_SIZE < 60 ? (
                <div className="mt-8 text-center">
                  <Link href={withParams(path, { ...searchParams }, { page: String(state.page + 1) })} scroll={false} className="inline-flex rounded-chip px-6 py-[13px] font-semibold shadow-[inset_0_0_0_1.5px_var(--sn-ink)] hover:bg-linen">
                    Xem thêm
                  </Link>
                </div>
              ) : null}
            </>
          ) : (
            <div className="px-4 py-16 text-center">
              <h2 className="text-lg font-bold">Chưa có món phù hợp</h2>
              <p className="mt-2 mb-4 text-muted">Bỏ bớt bộ lọc, hoặc để SENOVA gợi ý quà trong 3 chạm.</p>
              <div className="flex flex-wrap justify-center gap-2.5">
                {filtered ? (
                  <Link href={withParams(path, searchParams, { budget: undefined, badge: undefined, stock: undefined })} className="rounded-chip px-6 py-[13px] font-semibold shadow-[inset_0_0_0_1.5px_var(--sn-ink)]">
                    Bỏ bộ lọc
                  </Link>
                ) : null}
                <OpenUtilityLink utility="finder" className="rounded-chip bg-plum px-6 py-[13px] font-semibold text-white">Tìm quà trong 3 chạm</OpenUtilityLink>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
