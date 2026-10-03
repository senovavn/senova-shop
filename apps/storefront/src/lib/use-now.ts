'use client'

import { useSyncExternalStore } from 'react'

// One shared 1s ticker for every countdown on the page; null during SSR/hydration.
let now = 0
const listeners = new Set<() => void>()
let timer: ReturnType<typeof setInterval> | undefined

function subscribe(l: () => void) {
  listeners.add(l)
  if (!timer) {
    now = Date.now()
    timer = setInterval(() => {
      now = Date.now()
      listeners.forEach((x) => x())
    }, 1000)
  }
  return () => {
    listeners.delete(l)
    if (!listeners.size && timer) {
      clearInterval(timer)
      timer = undefined
    }
  }
}

export function useNow(): number | null {
  return useSyncExternalStore(subscribe, () => now || Date.now(), () => null)
}
