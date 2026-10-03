'use client'

import { useId, useRef, useState, type ReactNode } from 'react'

/** WAI-ARIA tabs: arrow keys move focus and selection, Home/End jump. */
export function Tabs({ tabs }: { tabs: { id: string; label: string; content: ReactNode }[] }) {
  const [active, setActive] = useState(0)
  const base = useId()
  const refs = useRef<(HTMLButtonElement | null)[]>([])
  const focus = (i: number) => {
    const n = (i + tabs.length) % tabs.length
    setActive(n)
    refs.current[n]?.focus()
  }
  return (
    <div className="mt-[30px]">
      <div role="tablist" aria-label="Thông tin sản phẩm" className="flex gap-1 overflow-x-auto border-b border-line">
        {tabs.map((t, i) => (
          <button
            key={t.id}
            ref={(el) => {
              refs.current[i] = el
            }}
            role="tab"
            id={`${base}-tab-${t.id}`}
            aria-controls={`${base}-panel-${t.id}`}
            aria-selected={i === active}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowRight') focus(i + 1)
              if (e.key === 'ArrowLeft') focus(i - 1)
              if (e.key === 'Home') focus(0)
              if (e.key === 'End') focus(tabs.length - 1)
            }}
            className={`border-b-[2.5px] px-3.5 py-3 font-semibold whitespace-nowrap ${i === active ? 'border-plum text-ink' : 'border-transparent text-muted'}`}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tabs.map((t, i) => (
        <div key={t.id} role="tabpanel" id={`${base}-panel-${t.id}`} aria-labelledby={`${base}-tab-${t.id}`} hidden={i !== active} tabIndex={0} className="pt-3.5">
          {t.content}
        </div>
      ))}
    </div>
  )
}
