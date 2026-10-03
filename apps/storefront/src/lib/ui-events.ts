'use client'

import { useEffect } from 'react'
import type { components } from '@/api/schema'

type Product = components['schemas']['Product']
export type UtilityKey = components['schemas']['Utility']['key']

// Cross-tree UI commands (open a sheet/modal from any island) without a global state library.
type EventMap = { 'quickview': Product; 'utility': UtilityKey; 'menu': undefined }

export function dispatchUi<K extends keyof EventMap>(name: K, detail: EventMap[K]) {
  window.dispatchEvent(new CustomEvent(`senova:${name}`, { detail }))
}

export function useUiEvent<K extends keyof EventMap>(name: K, handler: (detail: EventMap[K]) => void) {
  useEffect(() => {
    const fn = (e: Event) => handler((e as CustomEvent<EventMap[K]>).detail)
    window.addEventListener(`senova:${name}`, fn)
    return () => window.removeEventListener(`senova:${name}`, fn)
  }, [name, handler])
}

export const openUtility = (key: UtilityKey) => dispatchUi('utility', key)
export const openQuickView = (p: Product) => dispatchUi('quickview', p)
