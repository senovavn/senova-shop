// Mock merchandising content (banners, stories, vouchers, flash sale) mirroring prototype v3.
import type { components } from '@/api/schema'
import { image, mockConfig, productById } from './data'

type S = components['schemas']

export function mockBanners(now = new Date()): S['Banner'][] {
  const occ = mockConfig(now).next_occasion!
  return [
    { id: 'event', title: `Quà ${occ.label} đã sẵn sàng`, subtitle: 'Gói quà miễn phí, kịp giao toàn quốc', cta_label: 'Chọn quà ngay', action: { type: 'utility', value: 'event' }, tone_from: '#FFE3E8', tone_to: '#FFC7D1', image: image('sn-016') },
    { id: 'flash', title: 'Flash sale tới 23:59', subtitle: 'Ly giữ nhiệt, máy khuếch tán, gương LED giảm đến 20%', cta_label: 'Săn deal', action: { type: 'link', value: '/collection/sale' }, tone_from: '#FFF1C9', tone_to: '#FFD978', image: image('sn-001') },
    { id: 'engrave', title: 'Khắc tên miễn phí', subtitle: 'Dây chuyền, ví thẻ, khung ảnh: món quà không đụng hàng', cta_label: 'Khắc ngay', action: { type: 'utility', value: 'engrave' }, tone_from: '#E3EEF5', tone_to: '#C7DCEA', image: image('sn-009') },
    { id: 'new', title: 'Món mới: Bé Sữa & hoa len', subtitle: 'Đồ len móc tay đang là xu hướng quà ấm áp', cta_label: 'Xem món mới', action: { type: 'link', value: '/collection/new' }, tone_from: '#E8F1E6', tone_to: '#C9DEC4', image: image('sn-023') },
  ]
}

const story = (id: string, label: string, entries: [string, string][], shot = (j: number) => (j % 2 ? 1 : 2)): S['Story'] => ({
  id,
  label,
  items: entries.map(([pid, caption], j) => ({ product: productById(pid), caption, image: image(pid, shot(j)) })),
})

export function mockStories(now = new Date()): S['Story'][] {
  const occ = mockConfig(now).next_occasion!
  return [
    story('finds', 'SENOVA Finds', [['sn-002', 'Charm điện thoại đang “gây sốt”'], ['sn-003', 'Mây con len móc, mỗi chiếc một dáng'], ['sn-022', 'Giá đỡ từ tính cho bàn làm việc gọn gàng']]),
    story('event', `Quà ${occ.label}`, [['sn-016', 'Ngọc trai giọt nước tặng mẹ'], ['sn-019', 'Hướng dương len cho đồng nghiệp'], ['sn-015', 'Sen đá mini: quà cho cả phòng']]),
    story('worth', 'Worth it?', [['sn-001', 'Ly 900ml: giữ lạnh 24h thật không?'], ['sn-017', 'Hộp cơm 3 tầng: giữ ấm 5 tiếng']]),
    story('gem', 'Hidden Gem', [['sn-005', 'Đèn hâm nến cổ điển: thơm mà không cần lửa'], ['sn-021', 'Hộp nhạc quay tay Happy Birthday'], ['sn-012', 'Đèn ngủ đám mây']]),
    story('unbox', 'Mở hộp quà', [['sn-011', 'Little Box: mở ra là thấy thương'], ['sn-023', 'Bé Sữa trong hộp quà SENOVA']], () => 2),
  ]
}

export const mockVouchers: S['Voucher'][] = [
  { code: 'SENOVA10', label: 'Giảm 10% (tối đa 40K) cho đơn từ 200K', kind: 'percent', value: 10, max_discount: 40000, min_subtotal: 200000, short: '10%' },
  { code: 'FREESHIP', label: 'Miễn phí giao tiêu chuẩn cho đơn từ 150K', kind: 'shipping', min_subtotal: 150000, short: 'FREE SHIP' },
  { code: 'QUANHO', label: 'Giảm 30K cho đơn từ 350K', kind: 'amount', value: 30000, min_subtotal: 350000, short: '30K' },
]

/** Today's flash sale ends at 23:59:59 Vietnam time (UTC+7, no DST). */
export function mockFlashSale(now = new Date()): S['FlashSale'] | null {
  const vn = new Date(now.getTime() + 7 * 3600e3)
  const ends = new Date(Date.UTC(vn.getUTCFullYear(), vn.getUTCMonth(), vn.getUTCDate(), 23 - 7, 59, 59))
  const items = ['sn-001', 'sn-004', 'sn-007', 'sn-011', 'sn-014', 'sn-016', 'sn-021', 'sn-024']
    .map(productById)
    .filter((p) => p.variants[0].compare_at)
    .map((product, i) => ({ product, claimed_pct: 40 + ((i * 23) % 50) }))
  return items.length ? { id: `flash-${ends.toISOString().slice(0, 10)}`, ends_at: ends.toISOString(), items } : null
}

export const mockProvinces = [
  'TP. Hồ Chí Minh', 'Hà Nội', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ', 'Huế', 'An Giang', 'Bắc Ninh', 'Cà Mau', 'Cao Bằng',
  'Đắk Lắk', 'Điện Biên', 'Đồng Nai', 'Đồng Tháp', 'Gia Lai', 'Hà Tĩnh', 'Hưng Yên', 'Khánh Hòa', 'Lai Châu', 'Lâm Đồng',
  'Lạng Sơn', 'Lào Cai', 'Nghệ An', 'Ninh Bình', 'Phú Thọ', 'Quảng Ngãi', 'Quảng Ninh', 'Quảng Trị', 'Sơn La', 'Tây Ninh',
  'Thái Nguyên', 'Thanh Hóa', 'Tuyên Quang', 'Vĩnh Long',
].map((name, i) => ({ code: String(i + 1).padStart(2, '0'), name }))

export const mockCollections: S['Collection'][] = [
  { slug: 'hot', title: 'Đang hot', description: 'Những món bán chạy nhất tuần này.' },
  { slug: 'new', title: 'Món mới tìm thấy', description: 'Món mới và viên ngọc ẩn SENOVA vừa tìm được.' },
  { slug: 'gift-ready', title: 'Gói sẵn để tặng', description: 'Đã có hộp, đai và thiệp, chỉ việc trao tay.' },
  { slug: 'sale', title: 'Đang ưu đãi', description: 'Món đang giảm giá, số lượng có hạn.' },
  { slug: 'personal', title: 'Khắc tên riêng', description: 'Khắc chữ miễn phí, món quà không đụng hàng.' },
]
