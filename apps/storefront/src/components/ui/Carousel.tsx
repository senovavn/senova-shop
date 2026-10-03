'use client'

import { useRef, type ReactNode } from 'react'

/** Horizontal scroll-snap row with prev/next buttons. Columns: 4 desktop, 3 tablet, ~2 phone. */
export function Carousel({ label, children, heading }: { label: string; children: ReactNode[]; heading?: ReactNode }) {
  const track = useRef<HTMLUListElement>(null)
  const scroll = (dir: 1 | -1) => {
    const el = track.current
    if (!el) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: reduce ? 'auto' : 'smooth' })
  }
  const arrow =
    'grid size-[42px] place-items-center rounded-full border-[1.5px] border-line bg-card text-lg text-ink transition-colors hover:border-plum hover:bg-plum hover:text-white'
  return (
    <div>
      <div className="mb-5 flex items-end justify-between gap-4">
        {heading}
        <div className="hidden gap-2 sm:flex">
          <button type="button" className={arrow} onClick={() => scroll(-1)} aria-label={`${label}: trước`}>‹</button>
          <button type="button" className={arrow} onClick={() => scroll(1)} aria-label={`${label}: sau`}>›</button>
        </div>
      </div>
      <ul
        ref={track}
        aria-label={label}
        className={`grid snap-x snap-mandatory auto-cols-[46%] grid-flow-col gap-3 overflow-x-auto pb-1.5 [scrollbar-width:none] sm:auto-cols-[calc((100%-2*16px)/3)] sm:gap-4 xl:auto-cols-[calc((100%-3*18px)/4)] xl:gap-[18px] [&::-webkit-scrollbar]:hidden`}
      >
        {children.map((c, i) => (
          <li key={i} className="snap-start">
            {c}
          </li>
        ))}
      </ul>
    </div>
  )
}
