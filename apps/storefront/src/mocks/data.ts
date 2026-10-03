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

export const productById = (id: string) => mockProducts.find((p) => p.id === id)!
/** Image `k` (0–2) of the first in-stock variant. Index 2 is the unboxing shot. */
export const image = (id: string, k = 0) => {
  const p = productById(id)
  return (p.variants.find((v) => v.stock > 0) ?? p.variants[0]).images[k]
}

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
      // Chat widget ships in Sprint 5; the shop owner switches it on in SourceLiq then.
      { key: 'chat', label: 'Chat tư vấn', enabled: false },
    ],
    next_occasion: nextOccasion(todayInVietnam(now)),
    categories: [
      { key: 'qua-tang', label: 'Quà tặng' },
      { key: 'phu-kien', label: 'Phụ kiện' },
      { key: 'nha-cua', label: 'Nhà cửa' },
      { key: 'du-lich', label: 'Du lịch' },
    ],
    recipients: [
      { key: 'ban-than', label: 'Bạn thân' },
      { key: 'ban-be', label: 'Bạn bè' },
      { key: 'nguoi-yeu', label: 'Người yêu' },
      { key: 'dong-nghiep', label: 'Đồng nghiệp' },
      { key: 'gia-dinh', label: 'Gia đình' },
    ],
    occasions: [
      { key: 'sinh-nhat', label: 'Sinh nhật' },
      { key: 'cam-on', label: 'Cảm ơn' },
      { key: 'ky-niem', label: 'Kỷ niệm' },
      { key: 'vi-muon-tang', label: 'Vì muốn tặng' },
      { key: 'tu-thuong', label: 'Tự thưởng' },
    ],
    budgets: [
      { key: 'duoi-150k', label: 'Dưới 150K', min: 0, max: 150000 },
      { key: '150k-300k', label: '150K – 300K', min: 150000, max: 300000 },
      { key: 'tren-300k', label: 'Trên 300K', min: 300000, max: 100000000 },
    ],
    gift_wrap_occasions: ['Sinh nhật', 'Cảm ơn', 'Kỷ niệm', 'Vì muốn tặng', 'Chúc mừng'],
    gift_wrap_image: image('sn-011', 2),
    home_collections: [
      { slug: 'hot', title: 'Đang hot', tone: 'sunbeam', image: image('sn-002') },
      { slug: 'new', title: 'Món mới tìm thấy', tone: 'lilac', image: image('sn-007') },
      { slug: 'gift-ready', title: 'Gói sẵn để tặng', tone: 'sage', image: image('sn-011') },
      { slug: 'personal', title: 'Khắc tên riêng', tone: 'mist', image: image('sn-009') },
    ],
    shipping: {
      express: { provinces: ['TP. Hồ Chí Minh', 'Hà Nội'], fee: 45000, cutoff: '16:00' },
      standard: { carriers: ['GHN', 'GHTK', 'SPX'], city_days: [1, 2], other_days: [2, 4] },
    },
    engrave: { max_length: 8, extra_days: 1 },
    faq: [
      { q: 'Có gói quà sẵn không?', a: 'Có, mọi đơn đều được gói quà miễn phí; bạn chọn dịp tặng và lời nhắn ở bước thanh toán.' },
      { q: 'Bao lâu thì nhận được?', a: '2–3 ngày với GHN, hỏa tốc 2 giờ nội thành TP. HCM và Hà Nội.' },
      { q: 'Đổi trả thế nào?', a: 'Đổi hoặc trả trong 7 ngày nếu sản phẩm lỗi, sai mẫu hoặc chưa vừa ý, còn nguyên tem. Sản phẩm khắc chữ chỉ đổi khi lỗi.' },
    ],
    trust: [
      { title: 'Giao nhanh', body: 'GHN, GHTK, SPX 2–5 ngày; hỏa tốc 2 giờ nội thành' },
      { title: 'Đổi trả 7 ngày', body: 'Đổi dễ nếu món chưa vừa ý' },
      { title: 'Thanh toán linh hoạt', body: 'COD, VietQR, ZaloPay, MoMo, VNPay, thẻ' },
      { title: 'Gói quà miễn phí', body: 'Hộp, đai theo dịp và thiệp lời nhắn' },
    ],
  }
}
