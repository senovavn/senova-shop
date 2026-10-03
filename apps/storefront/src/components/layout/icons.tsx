import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>
const base = (props: IconProps) => ({
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  focusable: false,
  ...props,
})

export const MenuIcon = (p: IconProps) => <svg {...base(p)}><path d="M4 7h16M4 12h16M4 17h16" /></svg>
export const SearchIcon = (p: IconProps) => <svg {...base(p)}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
export const HeartIcon = (p: IconProps) => <svg {...base(p)}><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" /></svg>
export const UserIcon = (p: IconProps) => <svg {...base(p)}><circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" /></svg>
export const BagIcon = (p: IconProps) => <svg {...base(p)}><path d="M5 8h14l-1.2 11H6.2z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></svg>
export const HomeIcon = (p: IconProps) => <svg {...base(p)}><path d="M4 11 12 4l8 7v9H4z" /></svg>
export const GridIcon = (p: IconProps) => <svg {...base(p)}><path d="M4 5h7v7H4zM13 5h7v7h-7zM4 14h7v6H4zM13 14h7v6h-7z" /></svg>
export const GiftIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 11h16v9H4zM3 7h18v4H3zM12 7v13" />
    <path d="M12 7C10 3 6 4 7.5 6.5 8.5 8 12 7 12 7zm0 0c2-4 6-3 4.5-.5C15.5 8 12 7 12 7z" />
  </svg>
)
export const CloseIcon = (p: IconProps) => <svg {...base(p)}><path d="M6 6l12 12M18 6 6 18" /></svg>

/** SENOVA four-point spark. */
export const Spark = ({ color = 'currentColor', ...p }: IconProps & { color?: string }) => (
  <svg viewBox="0 0 24 24" aria-hidden focusable={false} {...p}>
    <path d="M12 1Q13.87 10.13 23 12Q13.87 13.87 12 23Q10.13 13.87 1 12Q10.13 10.13 12 1Z" fill={color} />
  </svg>
)
