import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getBundle, getConfig, getProduct, getRelated, listProducts } from '@/api/client'
import { AddBundle } from '@/components/pdp/AddBundle'
import { ProductMain } from '@/components/pdp/ProductMain'
import { Tabs } from '@/components/pdp/Tabs'
import { Badge } from '@/components/product/Badge'
import { CheckIcon } from '@/components/product/CheckIcon'
import { ProductCard } from '@/components/product/ProductCard'
import { Stars } from '@/components/product/Stars'
import { Carousel } from '@/components/ui/Carousel'
import { formatVnd } from '@/lib/format'
import { defaultVariant } from '@/lib/product'

export const revalidate = 60
const SITE = 'https://senovagifts.com'

export async function generateStaticParams() {
  return (await listProducts({ limit: 60 })).map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: PageProps<'/p/[slug]'>): Promise<Metadata> {
  const p = await getProduct((await params).slug)
  if (!p) return {}
  const v = defaultVariant(p)
  return {
    title: p.name,
    description: p.description?.slice(0, 160),
    alternates: { canonical: `/p/${p.slug}` },
    openGraph: { title: p.name, description: p.why_gift, images: v.images.slice(0, 1), type: 'website' },
  }
}

/** schema.org Product + Offers + BreadcrumbList. No AggregateRating until reviews come from a verified source (rule 11). */
function jsonLd(p: NonNullable<Awaited<ReturnType<typeof getProduct>>>, categoryLabel?: string) {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: p.name,
      sku: p.id,
      description: p.description,
      image: defaultVariant(p).images.map((i) => new URL(i, SITE).toString()),
      brand: { '@type': 'Brand', name: 'SENOVA' },
      offers: p.variants.map((v) => ({
        '@type': 'Offer',
        sku: v.sku,
        name: `${p.name} – ${v.name}`,
        price: v.price,
        priceCurrency: 'VND',
        availability: v.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        url: `${SITE}/p/${p.slug}`,
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: SITE },
        ...(categoryLabel ? [{ '@type': 'ListItem', position: 2, name: categoryLabel, item: `${SITE}/c/${p.category}` }] : []),
        { '@type': 'ListItem', position: categoryLabel ? 3 : 2, name: p.name, item: `${SITE}/p/${p.slug}` },
      ],
    },
  ]
}

export default async function ProductPage({ params }: PageProps<'/p/[slug]'>) {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) notFound()
  const [config, related, bundle] = await Promise.all([getConfig(), getRelated(slug), getBundle(slug)])
  const cat = config.categories?.find((c) => c.key === product.category)
  const bundleSet = [product, ...bundle]
  const bundleTotal = bundleSet.reduce((sum, p) => sum + defaultVariant(p).price, 0)

  const header = (
    <>
      {product.badge ? <Badge code={product.badge} /> : null}
      <p className="mt-2 truncate">
        {product.rating ? <Stars rating={product.rating} count={product.review_count} /> : null}
        <span className="text-[12.5px] text-muted"> · {(product.sold_count ?? 0).toLocaleString('vi-VN')} đã bán</span>
      </p>
      <h1 className="mt-3 text-[clamp(28px,3.6vw,44px)] font-extrabold">{product.name}</h1>
      {product.name_en ? <p className="text-muted" lang="en">{product.name_en}</p> : null}
    </>
  )
  const details = (
    <>
      <ul className="mt-4">
        {product.highlights?.map((h) => (
          <li key={h} className="flex gap-2.5 py-[5px]"><CheckIcon />{h}</li>
        ))}
      </ul>
      {product.why_gift ? (
        <div className="mt-[18px] rounded-[20px] border-[1.5px] border-dashed border-lilac bg-lilac/15 p-4">
          <b className="text-[13.5px]">🎁 Vì sao đáng tặng</b>
          <p className="mt-1 text-[13.5px]">{product.why_gift} Gói quà, thiệp và ẩn giá miễn phí ở bước thanh toán.</p>
        </div>
      ) : null}
    </>
  )

  return (
    <div className="mx-auto max-w-[1280px] px-4 pb-20 sm:px-7 sm:pb-0">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(product, cat?.label)).replace(/</g, '\\u003c') }} />
      <nav aria-label="Breadcrumb" className="pt-5 text-[13px] text-muted">
        <ol className="flex flex-wrap gap-1">
          <li><Link href="/" className="underline underline-offset-2">Trang chủ</Link> /</li>
          {cat ? <li><Link href={`/c/${cat.key}`} className="underline underline-offset-2">{cat.label}</Link> /</li> : null}
          <li aria-current="page">{product.name}</li>
        </ol>
      </nav>

      <ProductMain product={product} config={config} header={header} details={details} />

      <div className="max-w-[760px]">
        <Tabs
          tabs={[
            { id: 'desc', label: 'Mô tả', content: <p>{product.description}</p> },
            {
              id: 'spec',
              label: 'Thông số',
              content: (
                <table className="w-full border-collapse text-sm">
                  <tbody>
                    {product.specs?.map((s) => (
                      <tr key={s.label} className="border-t border-line">
                        <th scope="row" className="w-2/5 py-2.5 text-left font-normal text-muted">{s.label}</th>
                        <td className="py-2.5">{s.value}</td>
                      </tr>
                    ))}
                    <tr className="border-t border-line">
                      <th scope="row" className="py-2.5 text-left font-normal text-muted">Đổi trả</th>
                      <td className="py-2.5">7 ngày, còn nguyên tem</td>
                    </tr>
                  </tbody>
                </table>
              ),
            },
            {
              id: 'reviews',
              label: `Đánh giá (${product.review_count ?? 0})`,
              content: product.rating ? (
                <div>
                  <p className="font-display text-3xl font-bold">{product.rating.toLocaleString('vi-VN')}<span className="text-base text-muted">/5</span></p>
                  <Stars rating={product.rating} count={product.review_count} />
                  <p className="mt-3 text-sm text-muted">Nội dung đánh giá chi tiết sẽ hiển thị khi được đồng bộ từ các kênh bán của SENOVA.</p>
                </div>
              ) : (
                <p className="text-sm text-muted">Chưa có đánh giá.</p>
              ),
            },
            {
              id: 'qa',
              label: 'Hỏi đáp',
              content: (
                <dl>
                  {config.faq?.map((f) => (
                    <div key={f.q} className="border-t border-line py-3.5">
                      <dt className="text-[13.5px] font-bold">{f.q}</dt>
                      <dd className="mt-1 text-[13.5px] text-muted">{f.a}</dd>
                    </div>
                  ))}
                </dl>
              ),
            },
          ]}
        />
      </div>

      {bundle.length ? (
        <section aria-labelledby="bundle" className="py-10">
          <h2 id="bundle" className="mb-4 text-[clamp(26px,3.2vw,38px)] font-bold">Thường được mua cùng</h2>
          <div className="flex flex-wrap items-center gap-3 rounded-[22px] border border-line bg-card p-[18px]">
            {bundleSet.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3">
                {i ? <span aria-hidden className="text-2xl text-muted">+</span> : null}
                <Link href={`/p/${p.slug}`} className="relative block size-24 overflow-hidden rounded-2xl bg-linen" aria-label={p.name}>
                  <Image src={defaultVariant(p).images[0]} alt="" fill sizes="96px" unoptimized className="object-cover" />
                </Link>
              </div>
            ))}
            <div className="ml-auto">
              <div className="text-[13.5px] text-muted">Tổng {bundleSet.length} món</div>
              <b className="text-[22px] text-plum dark:text-sunbeam">{formatVnd(bundleTotal)}</b>
              <br />
              <AddBundle products={bundleSet} />
            </div>
          </div>
        </section>
      ) : null}

      {related.length ? (
        <section className="pb-10">
          <Carousel label="Có thể bạn cũng thích" heading={<h2 className="text-[clamp(26px,3.2vw,38px)] font-bold">Có thể bạn cũng thích</h2>}>
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </Carousel>
        </section>
      ) : null}
    </div>
  )
}
