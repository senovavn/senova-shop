import type { Metadata } from 'next'
import { ListingView } from '@/components/listing/ListingView'

export const metadata: Metadata = { title: 'Tìm kiếm', robots: { index: false, follow: true } }

export default async function SearchPage({ searchParams }: PageProps<'/search'>) {
  const sp = await searchParams
  const q = (Array.isArray(sp.q) ? sp.q[0] : sp.q)?.trim() ?? ''
  return (
    <ListingView
      path="/search"
      title={q ? `Kết quả cho “${q}”` : 'Tìm kiếm'}
      base={q ? { q } : {}}
      keep={{ q: q || undefined }}
      searchParams={sp}
    />
  )
}
