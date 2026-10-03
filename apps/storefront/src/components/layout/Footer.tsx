import Link from 'next/link'
import type { StorefrontConfig } from '@/api/client'
import { Logo } from '@/components/brand/Logo'

export function Footer({ footer }: { footer: StorefrontConfig['footer'] }) {
  return (
    <footer className="mt-11 bg-plum pt-[46px] pb-[calc(30px+env(safe-area-inset-bottom,0px))] text-white/95">
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-[26px] px-4 sm:grid-cols-2 sm:px-7 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo uid="footer" className="w-[136px] text-white" />
          <p className="mt-3 max-w-[34ch] opacity-90">{footer.about}</p>
        </div>
        {footer.columns.map((col) => (
          <div key={col.title}>
            <h2 className="mb-2.5 font-display text-base font-bold">{col.title}</h2>
            <ul className="text-sm">
              {col.links.map((l) => (
                <li key={l.label} className="py-[3px]">
                  {l.href ? (
                    <Link href={l.href} className="opacity-90 hover:underline">{l.label}</Link>
                  ) : (
                    <span className="opacity-90">{l.label}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="mx-auto mt-[26px] max-w-[1280px] px-4 text-xs opacity-75 sm:px-7">{footer.legal}</p>
    </footer>
  )
}
