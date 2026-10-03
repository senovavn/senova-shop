// Mock SourceLiq data built from fixtures/storefront (prototype v3 demo data).
import fixtures from '../../../../fixtures/storefront/products.json'
import type { components } from '@/api/schema'
import { todayInVietnam } from '@/lib/date'

type Product = components['schemas']['Product']
type Config = components['schemas']['Config']
type Occasion = components['schemas']['Occasion']

type FixtureProduct = (typeof fixtures.products)[number]

export const MOCK_MEDIA_PREFIX = '/mock-media/'

function toProduct(p: FixtureProduct): Product {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    name_en: p.en,
    category: p.cat,
    badge: (p.badge ?? undefined) as Product['badge'],
    highlights: p.hl,
    description: p.desc,
    why_gift: p.why,
    specs: p.specs.map(([label, value]) => ({ label, value })),
    recipients: p.rec,
    occasions: p.occ,
    engravable: p.engrave,
    rating: p.rating,
    review_count: p.reviews,
    sold_count: p.sold,
    variants: p.variants.map((v) => ({
      sku: v.sku,
      name: v.name,
      hex: v.hex,
      price: p.price,
      compare_at: p.compare ?? undefined,
      stock: v.stock,
      images: v.images.map((src) => MOCK_MEDIA_PREFIX + src.replace(/^images\//, '')),
    })),
  }
}

export const mockProducts: Product[] = fixtures.products.map(toProduct)

// Occasions are configured by the shop owner in SourceLiq; month/day here, year resolved per request.
const OCCASIONS: Array<Omit<Occasion, 'date'> & { m: number; d: number }> = [
  { key: '20-10', m: 10, d: 20, label: '20/10', name: 'Ngày Phụ nữ Việt Nam', hint: 'quà cho mẹ, cô, đồng nghiệp nữ', recipient: 'gia-dinh' },
  { key: '20-11', m: 11, d: 20, label: '20/11', name: 'Ngày Nhà giáo', hint: 'quà tri ân thầy cô', recipient: 'dong-nghiep' },
  { key: 'noel', m: 12, d: 24, label: 'Noel', name: 'Giáng sinh', hint: 'quà trao tay mùa lễ', recipient: 'ban-be' },
  { key: 'valentine', m: 2, d: 14, label: '14/2', name: 'Valentine', hint: 'quà cho người thương', recipient: 'nguoi-yeu' },
  { key: '8-3', m: 3, d: 8, label: '8/3', name: 'Quốc tế Phụ nữ', hint: 'quà cho phái đẹp', recipient: 'gia-dinh' },
]

/** Next occasion on or after `today` (a YYYY-MM-DD date in Asia/Ho_Chi_Minh). */
export function nextOccasion(today: string): Occasion {
  const [y] = today.split('-').map(Number)
  const pad = (n: number) => String(n).padStart(2, '0')
  const candidates = OCCASIONS.map(({ m, d, ...rest }) => {
    let date = `${y}-${pad(m)}-${pad(d)}`
    if (date < today) date = `${y + 1}-${pad(m)}-${pad(d)}`
    return { ...rest, date }
  })
  return candidates.sort((a, b) => a.date.localeCompare(b.date))[0]
}

export function mockConfig(now = new Date()): Config {
  return {
    brand: { name: 'SENOVA', tagline: 'Little Things, Better Days.' },
    marquee: [
      'Freeship đơn từ 299.000₫',
      'Gói quà & thiệp miễn phí',
      'Khắc tên miễn phí',
      'Hỏa tốc 2 giờ tại HCM, Hà Nội',
      'Đổi trả 7 ngày',
      'Thanh toán COD, VietQR, ví điện tử',
    ],
    nav: [
      { label: 'Đang hot', href: '/collection/hot', highlight: true },
      { label: 'Quà tặng', href: '/c/qua-tang' },
      { label: 'Phụ kiện', href: '/c/phu-kien' },
      { label: 'Nhà cửa', href: '/c/nha-cua' },
      { label: 'Du lịch', href: '/c/du-lich' },
      { label: 'Gói sẵn để tặng', href: '/collection/gift-ready' },
    ],
    footer: {
      about: 'Little Things, Better Days. Món nhỏ đẹp, hữu ích và đáng tặng, được SENOVA chọn kỹ.',
      columns: [
        {
          title: 'Mua sắm',
          links: [
            { label: 'Đang hot', href: '/collection/hot' },
            { label: 'Món mới', href: '/collection/new' },
            { label: 'Gói sẵn để tặng', href: '/collection/gift-ready' },
            { label: 'Đang ưu đãi', href: '/collection/sale' },
          ],
        },
        {
          title: 'Hỗ trợ',
          links: [
            { label: 'Tra cứu đơn hàng', href: '/track' },
            { label: 'Giao hàng', href: '/policy/ship' },
            { label: 'Đổi trả 7 ngày', href: '/policy/return' },
            { label: 'Bảo mật dữ liệu', href: '/policy/privacy' },
          ],
        },
        {
          title: 'Kết nối',
          links: [
            { label: 'TikTok @senova.vn', href: '' },
            { label: 'Facebook SENOVA', href: '' },
            { label: 'Shopee SENOVA Official', href: '' },
            { label: 'Zalo OA SENOVA', href: '' },
          ],
        },
      ],
      legal: '© 2026 SENOVA. Dữ liệu demo: giá, chính sách, đánh giá và liên hệ sẽ được cập nhật từ SourceLiq.',
    },
    free_ship_threshold: 299000,
    utilities: [
      { key: 'event', label: 'Quà dịp lễ', enabled: true },
      { key: 'flash', label: 'Flash sale', enabled: true, badge: '-20%' },
      { key: 'voucher', label: 'Kho voucher', enabled: true, badge: '3' },
      { key: 'freeship', label: 'Freeship', enabled: true },
      { key: 'engrave', label: 'Khắc tên', enabled: true, badge: '0₫' },
      { key: 'express', label: 'Hỏa tốc 2h', enabled: true },
      { key: 'wrap', label: 'Gói quà', enabled: true },
      { key: 'finder', label: 'Tìm quà', enabled: true },
      { key: 'track', label: 'Theo dõi đơn', enabled: true },
      { key: 'chat', label: 'Chat tư vấn', enabled: true },
    ],
    next_occasion: nextOccasion(todayInVietnam(now)),
  }
}
