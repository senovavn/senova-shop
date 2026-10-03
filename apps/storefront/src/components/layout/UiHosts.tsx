'use client'

import dynamic from 'next/dynamic'
import { useCallback, useState } from 'react'
import type { components } from '@/api/schema'
import { useUiEvent, type UtilityKey } from '@/lib/ui-events'

type Product = components['schemas']['Product']

const UtilitySheets = dynamic(() => import('@/components/home/UtilitySheets').then((m) => m.UtilitySheets), { ssr: false })
const QuickView = dynamic(() => import('@/components/product/QuickView').then((m) => m.QuickView), { ssr: false })

/**
 * Loads the ActionSheet and QuickView code on first use, then hands over the triggering
 * request; afterwards the loaded hosts listen for events themselves.
 */
export function UiHosts({ config }: { config: components['schemas']['Config'] }) {
  const [utility, setUtility] = useState<{ first: UtilityKey } | null>(null)
  const [quick, setQuick] = useState<{ first: Product } | null>(null)
  useUiEvent('utility', useCallback((k: UtilityKey) => setUtility((u) => u ?? { first: k }), []))
  useUiEvent('quickview', useCallback((p: Product) => setQuick((q) => q ?? { first: p }), []))
  return (
    <>
      {utility ? <UtilitySheets config={config} initial={utility.first} /> : null}
      {quick ? <QuickView initial={quick.first} /> : null}
    </>
  )
}
