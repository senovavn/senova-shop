import type { components } from '@/api/schema'

type Product = components['schemas']['Product']
type Variant = components['schemas']['Variant']

/** First in-stock variant, else the first one (shown as sold out). */
export const defaultVariant = (p: Product): Variant => p.variants.find((v) => v.stock > 0) ?? p.variants[0]
export const inStock = (p: Product) => p.variants.some((v) => v.stock > 0)
export const discountPct = (v: Variant) => (v.compare_at ? Math.round((1 - v.price / v.compare_at) * 100) : 0)

export type BadgeKey = NonNullable<Product['badge']>
/** Display names and token colors for SourceLiq badge codes. */
export const BADGES: Record<BadgeKey, { label: string; bg: string; fg: string; spark: string }> = {
  'SENOVA PICK': { label: 'SENOVA CHỌN', bg: 'var(--sn-plum)', fg: 'var(--sn-bg)', spark: 'var(--sn-sunbeam)' },
  'NEW FIND': { label: 'MỚI TÌM THẤY', bg: 'var(--sn-sunbeam)', fg: 'var(--sn-on-light)', spark: 'var(--sn-plum)' },
  'GIFT READY': { label: 'SẴN GÓI QUÀ', bg: 'var(--sn-sage)', fg: 'var(--sn-on-light)', spark: 'var(--sn-plum)' },
  'MOST LOVED': { label: 'ĐƯỢC YÊU THÍCH', bg: 'var(--sn-lilac)', fg: 'var(--sn-on-light)', spark: 'var(--sn-plum)' },
  LIMITED: { label: 'CÓ HẠN', bg: 'var(--sn-on-light)', fg: 'var(--sn-sunbeam)', spark: 'var(--sn-sunbeam)' },
  'HIDDEN GEM': { label: 'VIÊN NGỌC ẨN', bg: 'var(--sn-mist)', fg: 'var(--sn-on-light)', spark: 'var(--sn-plum)' },
}
