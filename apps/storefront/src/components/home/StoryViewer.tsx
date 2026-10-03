'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { components } from '@/api/schema'
import { MONOGRAM_SVG } from '@/components/brand/brand-svg'
import { CloseIcon } from '@/components/layout/icons'
import { quickAdd } from '@/components/product/CardActions'
import { formatVnd } from '@/lib/format'
import { defaultVariant } from '@/lib/product'
import { seenStoriesStore } from '@/lib/shopper'

type Story = components['schemas']['Story']

export const FRAME_MS = 5000

export function StoryViewer({ stories, start, onClose }: { stories: Story[]; start: number; onClose: () => void }) {
  const [pos, setPos] = useState({ s: start, f: 0 })
  const dialog = useRef<HTMLDialogElement>(null)
  const story = stories[pos.s]
  const item = story.items[pos.f]

  const step = useCallback(
    (d: 1 | -1) =>
      setPos(({ s, f }) => {
        const nf = f + d
        if (nf < 0) return { s, f: 0 }
        if (nf < stories[s].items.length) return { s, f: nf }
        if (s < stories.length - 1) return { s: s + 1, f: 0 }
        queueMicrotask(onClose)
        return { s, f }
      }),
    [stories, onClose],
  )

  useEffect(() => {
    dialog.current?.showModal()
  }, [])
  useEffect(() => {
    seenStoriesStore.set((ids) => (ids.includes(story.id) ? ids : [...ids, story.id]))
  }, [story.id])
  useEffect(() => {
    const timer = setTimeout(() => step(1), FRAME_MS)
    return () => clearTimeout(timer)
  }, [pos, step])

  const p = item.product
  const v = defaultVariant(p)
  const ghost = 'rounded-chip bg-white/20 px-4 py-[13px] font-semibold text-white'
  return (
    <dialog
      ref={dialog}
      aria-label={`Story ${story.label}`}
      onClose={onClose}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') step(1)
        if (e.key === 'ArrowLeft') step(-1)
      }}
      className="m-0 h-dvh max-h-none w-screen max-w-none bg-black p-0 backdrop:bg-black"
    >
      <div className="relative mx-auto h-full max-h-[760px] w-full max-w-[420px] overflow-hidden bg-black sm:mt-[max(0px,calc((100dvh-760px)/2))] sm:rounded-3xl">
        <div className="absolute inset-x-3 top-3 z-[3] flex gap-1">
          {story.items.map((_, k) => (
            <span key={k} className="h-[3px] flex-1 overflow-hidden rounded bg-white/30">
              <span
                key={`${pos.s}-${pos.f}`}
                className={`sn-story-bar block h-full origin-left bg-white ${k < pos.f ? 'scale-x-100' : k === pos.f ? 'sn-story-bar--run' : 'scale-x-0'}`}
                style={{ animationDuration: `${FRAME_MS}ms` }}
              />
            </span>
          ))}
        </div>
        <div className="absolute inset-x-3.5 top-[26px] z-[3] flex items-center gap-2.5 text-[13px] font-semibold text-white">
          <span className="size-[34px] overflow-hidden rounded-full" dangerouslySetInnerHTML={{ __html: MONOGRAM_SVG }} />
          senova · {story.label}
          <button type="button" onClick={onClose} aria-label="Đóng story" className="ml-auto grid size-10 place-items-center rounded-full text-white">
            <CloseIcon className="size-5" />
          </button>
        </div>
        <div className="absolute inset-0">
          <Image src={item.image} alt={p.name} fill sizes="420px" unoptimized className="object-cover" />
        </div>
        <button type="button" aria-label="Khung trước" onClick={() => step(-1)} className="absolute top-0 bottom-[160px] left-0 z-[2] w-2/5" />
        <button type="button" aria-label="Khung sau" onClick={() => step(1)} className="absolute top-0 right-0 bottom-[160px] z-[2] w-2/5" />
        <div className="absolute inset-x-0 bottom-0 z-[3] bg-[linear-gradient(transparent,rgba(0,0,0,.75))] px-[18px] pt-[90px] pb-[22px] text-white">
          <p className="font-display text-[22px] leading-tight font-bold">{item.caption}</p>
          <p className="mt-1.5 mb-3.5 text-sm opacity-90">
            {p.name} · <b className="text-sunbeam">{formatVnd(v.price)}</b>
          </p>
          <div className="flex gap-2">
            <Link href={`/p/${p.slug}`} onClick={onClose} className="flex-1 rounded-chip bg-sunbeam px-4 py-[13px] text-center font-semibold text-on-light">
              Mua ngay
            </Link>
            <button type="button" className={`${ghost} flex-1`} onClick={() => quickAdd(p)}>
              + Giỏ
            </button>
          </div>
        </div>
      </div>
    </dialog>
  )
}
