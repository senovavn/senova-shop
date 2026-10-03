'use client'

import { useSyncExternalStore } from 'react'

const hourInVietnam = () => Number(new Intl.DateTimeFormat('en-GB', { hour: 'numeric', hourCycle: 'h23', timeZone: 'Asia/Ho_Chi_Minh' }).format(new Date()))

export function greetingFor(hour: number) {
  return hour < 11 ? 'Chào buổi sáng' : hour < 14 ? 'Chào buổi trưa' : hour < 18 ? 'Chào buổi chiều' : 'Chào buổi tối'
}

/** Time-of-day greeting computed in the browser (the page itself is cached for everyone). */
export function Greeting({ name }: { name?: string }) {
  const text = useSyncExternalStore(
    () => () => {},
    () => greetingFor(hourInVietnam()),
    () => 'Xin chào',
  )
  return (
    <h1 className="text-[clamp(24px,3vw,34px)] font-bold text-white">
      {text}, {name ?? 'bạn'} 👋
    </h1>
  )
}
