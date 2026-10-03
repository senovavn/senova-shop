import { describe, expect, it } from 'vitest'
import { deliveryEta } from './eta'

const shipping = {
  express: { provinces: ['TP. Hồ Chí Minh', 'Hà Nội'], fee: 45000, cutoff: '16:00' },
  standard: { carriers: ['GHN'], city_days: [1, 2], other_days: [2, 4] },
}
const now = new Date('2026-10-04T03:00:00Z') // Sun 4/10, 10:00 in Vietnam

describe('deliveryEta', () => {
  it('offers express in supported cities', () => {
    const eta = deliveryEta('Hà Nội', shipping, now)
    expect(eta.express).toBe(true)
    expect(eta.text).toBe('Hỏa tốc 2 giờ nếu đặt trước 16:00, hoặc tiêu chuẩn nhận Thứ 2, 5/10 – Thứ 3, 6/10.')
  })
  it('uses the standard window elsewhere and adds engraving days', () => {
    const eta = deliveryEta('Huế', shipping, now, 1)
    expect(eta.express).toBe(false)
    expect(eta.text).toBe('Nhận dự kiến Thứ 4, 7/10 – Thứ 6, 9/10 với GHN.')
  })
})
