import { Spark } from './icons'

/** Promo ticker. Decorative duplicate is hidden from assistive tech; motion stops under reduced-motion. */
export function Marquee({ items }: { items: string[] }) {
  if (!items.length) return null
  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 gap-10 pl-10" aria-hidden={hidden || undefined}>
      {items.map((text) => (
        <li key={text} className="inline-flex items-center gap-2">
          <Spark color="var(--sn-sunbeam)" className="size-3.5" />
          {text}
        </li>
      ))}
    </ul>
  )
  return (
    <div className="overflow-hidden bg-plum py-2 text-[13.5px] whitespace-nowrap text-white" role="region" aria-label="Ưu đãi">
      <div className="sn-marquee flex w-max">
        {row(false)}
        {row(true)}
      </div>
    </div>
  )
}
