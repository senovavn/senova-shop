import { Spark } from '@/components/layout/icons'
import { BADGES, type BadgeKey } from '@/lib/product'

const pill = 'inline-flex items-center gap-[5px] rounded-chip py-[5px] pr-[11px] pl-2 text-[11px] font-bold tracking-[.03em] whitespace-nowrap'

export function Badge({ code, className = '' }: { code: BadgeKey; className?: string }) {
  const b = BADGES[code]
  return (
    <span className={`${pill} ${className}`} style={{ background: b.bg, color: b.fg }}>
      <Spark color={b.spark} className="size-[13px]" />
      {b.label}
    </span>
  )
}

export function DiscountBadge({ pct, className = '' }: { pct: number; className?: string }) {
  return <span className={`${pill} bg-sunbeam pl-[11px] text-on-light ${className}`}>−{pct}%</span>
}
