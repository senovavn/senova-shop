'use client'

import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useId, useState } from 'react'
import { t } from '@/i18n/t'
import { formatVnd } from '@/lib/format'
import { sfGet, type S } from '@/lib/sf'
import { SearchIcon } from './icons'

const HINTS = ['ly giữ nhiệt', 'charm', 'nến thơm', 'khắc tên', 'hoa len']

/** Combobox: up to 5 accent-insensitive suggestions + "see all"; Enter submits /search. */
export function SearchBox() {
  const router = useRouter()
  const listId = useId()
  const [q, setQ] = useState('')
  const [debounced, setDebounced] = useState('')
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  useEffect(() => {
    const id = setTimeout(() => setDebounced(q.trim()), 150)
    return () => clearTimeout(id)
  }, [q])
  const { data } = useQuery({
    queryKey: ['suggest', debounced],
    queryFn: () => sfGet<{ items: S['Suggestion'][] }>('search/suggest', { q: debounced }),
    enabled: debounced.length > 0,
    placeholderData: (prev) => prev,
  })
  const items = debounced ? (data?.items ?? []) : []
  const go = (href: string) => {
    setOpen(false)
    router.push(href)
  }
  const all = `/search?q=${encodeURIComponent(q.trim())}`

  return (
    <form
      action="/search"
      role="search"
      className="relative ml-auto hidden max-w-[330px] flex-1 sm:block"
      onSubmit={(e) => {
        e.preventDefault()
        if (active >= 0 && items[active]) go(`/p/${items[active].slug}`)
        else if (q.trim()) go(all)
      }}
    >
      <SearchIcon className="pointer-events-none absolute top-3 left-3.5 size-[19px] text-muted" />
      <label htmlFor="header-q" className="sr-only">{t('header.search')}</label>
      <input
        id="header-q"
        name="q"
        type="search"
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
        autoComplete="off"
        placeholder={t('header.searchPlaceholder')}
        value={q}
        onChange={(e) => {
          setQ(e.target.value)
          setActive(-1)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown') {
            e.preventDefault()
            setActive((i) => Math.min(items.length - 1, i + 1))
          }
          if (e.key === 'ArrowUp') {
            e.preventDefault()
            setActive((i) => Math.max(-1, i - 1))
          }
          if (e.key === 'Escape') setOpen(false)
        }}
        className="h-11 w-full rounded-chip border-[1.5px] border-line bg-card pr-4 pl-[42px] transition-[border-color,box-shadow] focus:border-plum focus:shadow-[0_0_0_4px_color-mix(in_srgb,var(--sn-plum)_12%,transparent)] focus:outline-none"
      />
      {open ? (
        <div className="absolute inset-x-0 top-[50px] z-[5] overflow-hidden rounded-2xl border border-line bg-card shadow-[0_18px_40px_-20px_rgba(0,0,0,.35)]">
          {!debounced ? (
            <p className="px-3 py-2.5 text-[13.5px] text-muted">
              Gợi ý:{' '}
              {HINTS.map((h, i) => (
                <span key={h}>
                  <button type="button" className="underline" onMouseDown={(e) => (e.preventDefault(), go(`/search?q=${encodeURIComponent(h)}`))}>{h}</button>
                  {i < HINTS.length - 1 ? ', ' : ''}
                </span>
              ))}
            </p>
          ) : items.length ? (
            <ul id={listId} role="listbox" aria-label="Gợi ý tìm kiếm">
              {items.map((s, i) => (
                <li
                  key={s.slug}
                  id={`${listId}-${i}`}
                  role="option"
                  aria-selected={i === active}
                  onMouseDown={(e) => (e.preventDefault(), go(`/p/${s.slug}`))}
                  className={`flex cursor-pointer items-center gap-2.5 px-3 py-2 ${i === active ? 'bg-linen' : 'hover:bg-linen'}`}
                >
                  <span className="relative size-[42px] flex-none overflow-hidden rounded-[10px] bg-linen">
                    <Image src={s.image} alt="" fill sizes="42px" unoptimized className="object-cover" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13.5px] font-semibold">{s.name}</span>
                    <span className="text-xs font-bold text-plum dark:text-sunbeam">{formatVnd(s.price)}</span>
                  </span>
                </li>
              ))}
              <li role="option" aria-selected={false} onMouseDown={(e) => (e.preventDefault(), go(all))} className="cursor-pointer px-3 py-2.5 text-center text-[13.5px] font-semibold hover:bg-linen">
                Xem tất cả kết quả
              </li>
            </ul>
          ) : (
            <p className="px-3 py-3 text-[13.5px] text-muted" role="status">Không thấy “{debounced}”. Thử từ khóa khác nhé.</p>
          )}
        </div>
      ) : null}
    </form>
  )
}
