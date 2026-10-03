'use client'

import { useSyncExternalStore } from 'react'

/**
 * Tiny per-browser store backed by localStorage. Server render and the first client render
 * both use `initial`, so markup never mismatches; saved state appears right after hydration.
 * Storage failures (private mode, quota) degrade to in-memory state.
 */
export function createLocalStore<T>(key: string, initial: T) {
  let value = initial
  let loaded = false
  const listeners = new Set<() => void>()

  const load = () => {
    if (loaded || typeof window === 'undefined') return
    loaded = true
    try {
      const raw = window.localStorage.getItem(key)
      if (raw !== null) value = JSON.parse(raw) as T
    } catch {}
  }
  const emit = () => listeners.forEach((l) => l())

  const store = {
    get(): T {
      load()
      return value
    },
    set(next: T | ((prev: T) => T)) {
      load()
      value = typeof next === 'function' ? (next as (prev: T) => T)(value) : next
      try {
        window.localStorage.setItem(key, JSON.stringify(value))
      } catch {}
      emit()
    },
    subscribe(listener: () => void) {
      listeners.add(listener)
      const onStorage = (e: StorageEvent) => {
        if (e.key !== key) return
        loaded = false
        load()
        emit()
      }
      window.addEventListener('storage', onStorage)
      return () => {
        listeners.delete(listener)
        window.removeEventListener('storage', onStorage)
      }
    },
    use(): T {
      return useSyncExternalStore(store.subscribe, store.get, () => initial)
    },
    /** Test helper. */
    reset() {
      value = initial
      loaded = true
      emit()
    },
  }
  return store
}
