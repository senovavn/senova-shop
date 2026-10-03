import type { UtilityKey } from '@/lib/ui-events'

const PATHS: Record<UtilityKey, string> = {
  event: 'M4 11h16v9H4zM3 7h18v4H3zM12 7v13M12 7C10 3 6 4 7.5 6.5 8.5 8 12 7 12 7zm0 0c2-4 6-3 4.5-.5C15.5 8 12 7 12 7z',
  flash: 'M13 2 4 14h7l-1 8 9-12h-7z',
  voucher: 'M3 8a2 2 0 0 0 0 4v4h18v-4a2 2 0 0 1 0-4V4H3zM14 4v12',
  freeship: 'M2 6h12v10H2zM14 10h4l3 3v3h-7M8 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM19 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0z',
  engrave: 'm4 20 4-1 11-11-3-3L5 16zM14 6l3 3',
  express: 'M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18zM12 7v5l3 2',
  wrap: 'M3 8l9-5 9 5v8l-9 5-9-5zM3 8l9 5 9-5M12 13v8',
  finder: 'M12 3c.8 4.5 2.5 6.2 7 7-4.5.8-6.2 2.5-7 7-.8-4.5-2.5-6.2-7-7 4.5-.8 6.2-2.5 7-7z',
  track: 'M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11zM12 7.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5z',
  chat: 'M4 5h16v11H9l-5 4z',
}

export function UtilityIcon({ k, className = 'size-[26px]', color = '#fff' }: { k: UtilityKey; className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={PATHS[k]} />
    </svg>
  )
}

/** Gradient tile background from the tokens' utilityGradients. */
export const utilityGradient = (k: UtilityKey) => `linear-gradient(145deg, var(--sn-util-${k}-from), var(--sn-util-${k}-to))`
