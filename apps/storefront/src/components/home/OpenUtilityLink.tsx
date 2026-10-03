'use client'

import type { ReactNode } from 'react'
import { openUtility, type UtilityKey } from '@/lib/ui-events'

export function OpenUtilityLink({ utility, children, className = 'cursor-pointer text-sm font-semibold underline underline-offset-4' }: { utility: UtilityKey; children: ReactNode; className?: string }) {
  return (
    <button type="button" className={className} onClick={() => openUtility(utility)}>
      {children}
    </button>
  )
}
