'use client'

import { useEffect, useState, type ReactNode } from 'react'

/** Sticky header frame. Height never changes on scroll (no layout shift); only shadow, border and logo scale do. */
export function HeaderShell({ children }: { children: ReactNode }) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <header
      data-scrolled={scrolled}
      className="group sticky top-0 z-30 border-b border-transparent bg-bg/90 backdrop-blur-md backdrop-saturate-150 transition-[border-color,box-shadow] duration-300 data-[scrolled=true]:border-line data-[scrolled=true]:shadow-[0_8px_24px_-18px_color-mix(in_srgb,var(--sn-plum-deep)_35%,transparent)]"
    >
      {children}
    </header>
  )
}
