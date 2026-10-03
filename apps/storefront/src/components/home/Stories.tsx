'use client'

import Image from 'next/image'
import dynamic from 'next/dynamic'
import { useState } from 'react'
import type { components } from '@/api/schema'
import { seenStoriesStore } from '@/lib/shopper'

type Story = components['schemas']['Story']

// Viewer code loads on first tap.
const StoryViewer = dynamic(() => import('./StoryViewer').then((m) => m.StoryViewer), { ssr: false })

/** Story rings. Viewer: 5s per frame, tap left/right or ←/→, Esc closes, no sound. */
export function Stories({ stories }: { stories: Story[] }) {
  const seen = seenStoriesStore.use()
  const [open, setOpen] = useState<number | null>(null)
  return (
    <>
      <ul className="flex gap-4 overflow-x-auto px-0.5 pt-1.5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" aria-label="Story">
        {stories.map((s, i) => (
          <li key={s.id}>
            <button type="button" onClick={() => setOpen(i)} className="flex w-[84px] flex-none flex-col items-center gap-1.5 text-[12.5px] font-semibold">
              <span className={`block size-[76px] rounded-full p-[3px] ${seen.includes(s.id) ? 'bg-line' : 'bg-[conic-gradient(var(--sn-sunbeam),var(--sn-util-event-to),var(--sn-plum),var(--sn-lilac),var(--sn-sunbeam))]'}`}>
                <span className="relative block size-full overflow-hidden rounded-full border-[3px] border-card">
                  <Image src={s.items[0].image} alt="" fill sizes="76px" unoptimized className="object-cover" />
                </span>
              </span>
              {s.label}
              {seen.includes(s.id) ? <span className="sr-only">(đã xem)</span> : null}
            </button>
          </li>
        ))}
      </ul>
      {open !== null ? <StoryViewer stories={stories} start={open} onClose={() => setOpen(null)} /> : null}
    </>
  )
}
