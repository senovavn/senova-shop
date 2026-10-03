'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { components } from '@/api/schema'
import { Spark } from '@/components/layout/icons'
import { openUtility, type UtilityKey } from '@/lib/ui-events'

type Banner = components['schemas']['Banner']

const INTERVAL = 5000

/**
 * Auto-advances every 5s once the visitor has interacted with the page (scroll, touch, key):
 * rotating before that keeps re-triggering LCP on every new slide. Pauses on hover, focus,
 * hidden tab, reduced-motion and via the pause button (WCAG 2.2.2). Arrow keys switch slides.
 */
export function BannerCarousel({ banners }: { banners: Banner[] }) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [stopped, setStopped] = useState(false)
  const [engaged, setEngaged] = useState(false)
  const reduce = useRef(false)
  const go = useCallback((i: number) => setIndex((i + banners.length) % banners.length), [banners.length])

  useEffect(() => {
    reduce.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const events = ['scroll', 'pointerdown', 'keydown', 'touchstart'] as const
    const engage = () => {
      setEngaged(true)
      events.forEach((e) => window.removeEventListener(e, engage))
    }
    events.forEach((e) => window.addEventListener(e, engage, { passive: true, once: true }))
    return () => events.forEach((e) => window.removeEventListener(e, engage))
  }, [])
  useEffect(() => {
    if (!engaged || paused || stopped || banners.length < 2) return
    const id = setInterval(() => {
      if (!document.hidden && !reduce.current) setIndex((i) => (i + 1) % banners.length)
    }, INTERVAL)
    return () => clearInterval(id)
  }, [engaged, paused, stopped, banners.length])

  if (!banners.length) return null
  return (
    <section
      aria-roledescription="carousel"
      aria-label="Ưu đãi nổi bật"
      className="relative grid min-h-[210px] overflow-hidden rounded-[22px] shadow-[0_30px_60px_-30px_rgba(0,0,0,.6)] sm:min-h-[260px] sm:rounded-[28px] lg:min-h-[320px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => !e.currentTarget.contains(e.relatedTarget as Node) && setPaused(false)}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') go(index + 1)
        if (e.key === 'ArrowLeft') go(index - 1)
      }}
    >
      {banners.map((b, i) => {
        const active = i === index
        const cta = 'inline-flex rounded-chip bg-plum px-6 py-[13px] font-semibold text-white hover:bg-plum-deep'
        return (
          <div
            key={b.id}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} / ${banners.length}`}
            aria-hidden={!active}
            inert={!active}
            className={`relative grid grid-cols-[1.2fr_.8fr] [grid-area:1/1] items-center px-[18px] pt-[18px] pb-14 text-on-light transition-[opacity,transform] duration-700 ease-senova sm:grid-cols-[1.1fr_.9fr] sm:px-[30px] sm:pt-[30px] sm:pb-16 ${active ? 'z-[1] scale-100 opacity-100' : 'scale-[1.03] opacity-0'}`}
            style={{ background: `linear-gradient(135deg, ${b.tone_from}, ${b.tone_to})` }}
          >
            <div>
              <span className="inline-flex items-center gap-[5px] rounded-chip bg-on-light/10 py-[5px] pr-[11px] pl-2 text-[11px] font-bold tracking-[.03em]">
                <Spark color="var(--sn-plum)" className="size-[13px]" /> SENOVA
              </span>
              <h2 className="mt-3 text-[22px] leading-[1.05] font-extrabold sm:text-[clamp(26px,3vw,40px)]">{b.title}</h2>
              {b.subtitle ? <p className="mt-2.5 mb-[18px] hidden text-[15px] sm:block">{b.subtitle}</p> : <div className="h-3" />}
              {b.action.type === 'link' ? (
                <Link href={b.action.value} className={cta}>{b.cta_label}</Link>
              ) : (
                <button type="button" className={cta} onClick={() => openUtility(b.action.value as UtilityKey)}>{b.cta_label}</button>
              )}
            </div>
            {b.image ? (
              <div className="flex items-center justify-center self-stretch">
                <div className="relative aspect-square w-full max-w-[280px] overflow-hidden rounded-3xl shadow-[0_24px_40px_-24px_rgba(0,0,0,.5)]">
                  <Image src={b.image} alt="" fill sizes="(min-width:1024px) 280px, 40vw" unoptimized loading={i === 0 ? 'eager' : 'lazy'} fetchPriority={i === 0 ? 'high' : 'auto'} className="object-cover" />
                </div>
              </div>
            ) : null}
          </div>
        )
      })}
      <div className="absolute bottom-[18px] left-[18px] z-[2] flex items-center gap-1.5 sm:left-[30px]">
        <button
          type="button"
          onClick={() => setStopped((s) => !s)}
          aria-label={stopped ? 'Tiếp tục tự chuyển banner' : 'Tạm dừng tự chuyển banner'}
          className="mr-1 grid size-6 place-items-center rounded-full bg-on-light/10 text-on-light"
        >
          <svg viewBox="0 0 24 24" className="size-3.5" fill="currentColor" aria-hidden>
            {stopped ? <path d="M8 5v14l11-7z" /> : <path d="M7 5h3v14H7zM14 5h3v14h-3z" />}
          </svg>
        </button>
        {banners.map((b, i) => (
          <button
            key={b.id}
            type="button"
            aria-label={`Banner ${i + 1}: ${b.title}`}
            aria-current={i === index}
            onClick={() => go(i)}
            className="grid h-6 w-6 place-items-start content-center"
          >
            <span className={`block h-2 w-6 origin-left rounded-full bg-on-light transition-[transform,opacity] duration-300 ${i === index ? 'scale-x-100' : 'scale-x-[.34] opacity-25'}`} />
          </button>
        ))}
      </div>
    </section>
  )
}
