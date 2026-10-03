import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCollection } from '@/api/client'
import { ListingView } from '@/components/listing/ListingView'

export const revalidate = 60

export async function generateMetadata({ params }: PageProps<'/collection/[slug]'>): Promise<Metadata> {
  const { slug } = await params
  const c = await getCollection(slug)
  return c ? { title: c.title, description: c.description, alternates: { canonical: `/collection/${slug}` } } : {}
}

export default async function CollectionPage({ params, searchParams }: PageProps<'/collection/[slug]'>) {
  const { slug } = await params
  const c = await getCollection(slug)
  if (!c) notFound()
  return <ListingView path={`/collection/${slug}`} title={c.title} description={c.description} base={{ coll: slug }} searchParams={await searchParams} />
}
