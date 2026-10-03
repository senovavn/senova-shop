import type { Metadata } from 'next'
import { getConfig } from '@/api/client'
import { ListingView } from '@/components/listing/ListingView'

export const metadata: Metadata = { title: 'Gợi ý quà cho bạn', robots: { index: false, follow: true } }

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) || undefined

export default async function FinderPage({ searchParams }: PageProps<'/finder'>) {
  const sp = await searchParams
  const config = await getConfig()
  const rec = config.recipients?.find((r) => r.key === one(sp.rec))
  const occ = config.occasions?.find((o) => o.key === one(sp.occ))
  const budget = config.budgets?.find((b) => b.key === one(sp.budget))
  const tags = [rec?.label, occ?.label, budget?.label].filter(Boolean)
  return (
    <ListingView
      path="/finder"
      title="Gợi ý quà cho bạn"
      subtitle={tags.length ? `Dành cho: ${tags.join(' · ')}` : undefined}
      base={{ rec: rec?.key, occ: occ?.key }}
      keep={{ rec: rec?.key, occ: occ?.key }}
      searchParams={sp}
    />
  )
}
