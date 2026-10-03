import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getConfig } from '@/api/client'
import { ListingView } from '@/components/listing/ListingView'

export const revalidate = 60

export async function generateStaticParams() {
  return (await getConfig()).categories?.map((c) => ({ slug: c.key })) ?? []
}

async function category(slug: string) {
  return (await getConfig()).categories?.find((c) => c.key === slug)
}

export async function generateMetadata({ params }: PageProps<'/c/[slug]'>): Promise<Metadata> {
  const { slug } = await params
  const c = await category(slug)
  return c ? { title: c.label, alternates: { canonical: `/c/${slug}` } } : {}
}

export default async function CategoryPage({ params, searchParams }: PageProps<'/c/[slug]'>) {
  const { slug } = await params
  const c = await category(slug)
  if (!c) notFound()
  return <ListingView path={`/c/${slug}`} title={c.label} base={{ cat: slug }} searchParams={await searchParams} category={slug} />
}
