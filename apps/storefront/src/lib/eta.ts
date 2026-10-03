import type { components } from '@/api/schema'

type Shipping = NonNullable<components['schemas']['Config']['shipping']>

const fmt = (d: Date) =>
  new Intl.DateTimeFormat('vi-VN', { weekday: 'short', day: 'numeric', month: 'numeric', timeZone: 'Asia/Ho_Chi_Minh' }).format(d)
const addDays = (d: Date, n: number) => new Date(d.getTime() + n * 864e5)

export type Eta = { express: boolean; text: string }

/** Delivery estimate shown on PDP and in the express sheet. Real quotes come from carriers at checkout. */
export function deliveryEta(province: string, shipping: Shipping, now = new Date(), extraDays = 0): Eta {
  const express = shipping.express.provinces.includes(province)
  const [a, b] = express ? shipping.standard.city_days : shipping.standard.other_days
  const range = `${fmt(addDays(now, a + extraDays))} – ${fmt(addDays(now, b + extraDays))}`
  return express
    ? { express, text: `Hỏa tốc 2 giờ nếu đặt trước ${shipping.express.cutoff}, hoặc tiêu chuẩn nhận ${range}.` }
    : { express, text: `Nhận dự kiến ${range} với ${shipping.standard.carriers[0]}.` }
}
