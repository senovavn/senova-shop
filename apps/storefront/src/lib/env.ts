import 'server-only'

export type ApiMode = 'mock' | 'live'

const DEFAULT_BASE = 'https://api.sourceliq.vn/v1/storefront'

// Without an explicit live configuration the app runs on fixtures, never against production by accident.
export function apiEnv() {
  const base = process.env.STOREFRONT_API_BASE || DEFAULT_BASE
  const mode: ApiMode =
    process.env.STOREFRONT_API_MODE === 'live' && process.env.STOREFRONT_API_BASE ? 'live' : 'mock'
  const host = process.env.STOREFRONT_HOST || 'senovagifts.com'
  return { mode, base, host }
}
