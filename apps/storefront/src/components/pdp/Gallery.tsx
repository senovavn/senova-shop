'use client'

import Image from 'next/image'
import { useRef, useState } from 'react'

const CAPTIONS = ['Ảnh studio', 'Đặt trong không gian sống', 'Khoảnh khắc mở quà']

/** Scroll-snap gallery: thumbnails (≥640px), swipe + dots (phone), pointer zoom on fine pointers. */
export function Gallery({ images, name }: { images: string[]; name: string }) {
  const track = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)
  const goTo = (i: number) => {
    const el = track.current
    if (!el) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollTo({ left: i * el.clientWidth, behavior: reduce ? 'auto' : 'smooth' })
    setIndex(i)
  }
  return (
    <div className="lg:sticky lg:top-[90px]">
      <div
        ref={track}
        aria-label={`Ảnh ${name}`}
        aria-roledescription="carousel"
        onScroll={(e) => {
          const el = e.currentTarget
          const i = Math.round(el.scrollLeft / el.clientWidth)
          if (i !== index) setIndex(i)
        }}
        className="grid aspect-square snap-x snap-mandatory auto-cols-[100%] grid-flow-col overflow-x-auto overflow-y-hidden rounded-[28px] bg-linen [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {images.map((src, i) => (
          <Zoom key={src} src={src} alt={i === 0 ? name : `${name}: ${CAPTIONS[i] ?? `ảnh ${i + 1}`}`} eager={i === 0} />
        ))}
      </div>
      <div className="mt-3 hidden gap-2.5 sm:flex">
        {images.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Xem ảnh ${i + 1}`}
            aria-current={i === index}
            className={`relative size-20 overflow-hidden rounded-2xl border-2 bg-linen transition-colors ${i === index ? 'border-plum' : 'border-transparent'}`}
          >
            <Image src={src} alt="" fill sizes="80px" unoptimized className="object-cover" />
          </button>
        ))}
      </div>
      <div className="mt-2.5 flex justify-center gap-1.5 sm:hidden" aria-hidden>
        {images.map((src, i) => (
          <span key={src} className={`h-[7px] w-5 origin-center rounded-full transition-[transform,background-color] ${i === index ? 'bg-plum' : 'scale-x-[.35] bg-line'}`} />
        ))}
      </div>
    </div>
  )
}

function Zoom({ src, alt, eager }: { src: string; alt: string; eager: boolean }) {
  const img = useRef<HTMLImageElement>(null)
  return (
    <div
      className="relative snap-start overflow-hidden"
      onPointerMove={(e) => {
        if (e.pointerType !== 'mouse' || !img.current) return
        const r = e.currentTarget.getBoundingClientRect()
        img.current.style.transformOrigin = `${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`
        img.current.style.transform = 'scale(1.6)'
      }}
      onPointerLeave={() => {
        if (img.current) img.current.style.transform = ''
      }}
    >
      <Image
        ref={img}
        src={src}
        alt={alt}
        fill
        sizes="(min-width:1024px) 640px, 100vw"
        unoptimized
        loading={eager ? 'eager' : 'lazy'}
        fetchPriority={eager ? 'high' : 'auto'}
        className="cursor-zoom-in object-cover transition-transform duration-300"
      />
    </div>
  )
}
