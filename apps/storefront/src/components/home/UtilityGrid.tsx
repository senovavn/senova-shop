'use client'

import type { StorefrontConfig } from '@/api/client'
import { openUtility } from '@/lib/ui-events'
import { UtilityIcon, utilityGradient } from './utility-icons'

/** Ten-up icon grid; each tile opens its ActionSheet. Disabled utilities are hidden. */
export function UtilityGrid({ utilities, daysToOccasion, occasionLabel }: { utilities: StorefrontConfig['utilities']; daysToOccasion?: number; occasionLabel?: string }) {
  return (
    <ul aria-label="Tiện ích" className="grid grid-cols-5 gap-x-0.5 gap-y-3 sm:gap-x-1.5 sm:gap-y-3.5">
      {utilities
        .filter((u) => u.enabled)
        .map((u) => {
          const label = u.key === 'event' && occasionLabel ? `Quà ${occasionLabel}` : u.label
          const tag = u.key === 'event' && daysToOccasion !== undefined && daysToOccasion <= 30 ? `${daysToOccasion} ngày` : u.badge
          return (
            <li key={u.key}>
              <button
                type="button"
                onClick={() => openUtility(u.key)}
                className="relative flex w-full flex-col items-center gap-[7px] rounded-2xl px-0.5 py-1 text-center text-[11px] leading-tight font-semibold [overflow-wrap:anywhere] transition-transform hover:-translate-y-[3px] active:scale-[.94] sm:text-[12.5px]"
              >
                <span
                  className="relative grid size-12 place-items-center overflow-hidden rounded-2xl shadow-[0_10px_18px_-10px_rgba(0,0,0,.4),inset_0_1px_0_rgba(255,255,255,.35)] after:absolute after:inset-0 after:bg-[linear-gradient(160deg,rgba(255,255,255,.35),transparent_45%)] sm:size-[54px] sm:rounded-[18px]"
                  style={{ background: utilityGradient(u.key) }}
                >
                  <UtilityIcon k={u.key} className="relative z-[1] size-[23px] sm:size-[26px]" />
                </span>
                {tag ? (
                  <span className="absolute -top-1 right-1.5 z-[2] rounded-chip bg-alert px-1.5 py-0.5 text-[9.5px] font-extrabold text-white shadow-[0_0_0_2px_var(--sn-card)]">
                    {tag}
                  </span>
                ) : null}
                {label}
              </button>
            </li>
          )
        })}
    </ul>
  )
}
