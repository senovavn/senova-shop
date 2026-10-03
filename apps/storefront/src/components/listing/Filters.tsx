'use client'

import { useRef, type ReactNode } from 'react'
import { CloseIcon } from '@/components/layout/icons'
import { SORTS, type ListingState } from '@/lib/listing'
import { BADGES, type BadgeKey } from '@/lib/product'

type Option = { key: string; label: string }
type Props = {
  action: string
  hidden: Record<string, string | undefined>
  state: ListingState
  budgets: Option[]
  categories?: { current?: string; options: Option[] }
  total: number
  variant: 'sidebar' | 'button'
}

const label = 'flex cursor-pointer items-center gap-[9px] py-1 text-sm'
const radio = 'size-4 accent-plum'

/** GET form: works without JS; with JS, desktop applies on change, phone applies via the sheet button. */
export function Filters({ action, hidden, state, budgets, categories, total, variant }: Props) {
  const dialog = useRef<HTMLDialogElement>(null)
  const autoSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    if (window.matchMedia('(min-width: 1024px)').matches) e.currentTarget.requestSubmit()
  }
  const fields = (
    <>
      {Object.entries(hidden).map(([k, v]) => (v ? <input key={k} type="hidden" name={k} value={v} /> : null))}
      <input type="hidden" name="sort" value={state.sort} />
      {categories ? (
        <Group title="Danh mục">
          {categories.options.map((c) => (
            <a key={c.key} href={`/c/${c.key}`} className={`${label} ${categories.current === c.key ? 'font-bold text-plum dark:text-sunbeam' : ''}`} aria-current={categories.current === c.key ? 'page' : undefined}>
              {c.label}
            </a>
          ))}
        </Group>
      ) : null}
      <Group title="Giá">
        {[{ key: '', label: 'Tất cả' }, ...budgets].map((b) => (
          <label key={b.key} className={label}>
            <input className={radio} type="radio" name="budget" value={b.key} defaultChecked={(state.budget ?? '') === b.key} />
            {b.label}
          </label>
        ))}
      </Group>
      <Group title="Nhãn">
        {[['', 'Tất cả'] as const, ...(Object.keys(BADGES) as BadgeKey[]).map((k) => [k, BADGES[k].label] as const)].map(([k, l]) => (
          <label key={k} className={label}>
            <input className={radio} type="radio" name="badge" value={k} defaultChecked={(state.badge ?? '') === k} />
            {l}
          </label>
        ))}
      </Group>
      <Group title="Tình trạng">
        <label className={label}>
          <input className={radio} type="checkbox" name="stock" value="1" defaultChecked={state.stock} />
          Chỉ hàng còn sẵn
        </label>
      </Group>
    </>
  )
  if (variant === 'sidebar')
    return (
      <form action={action} onChange={autoSubmit} className="hidden lg:block" aria-label="Bộ lọc">
        <h2 className="text-lg font-bold">Bộ lọc</h2>
        {fields}
        <noscript>
          <button className="mt-4 rounded-chip bg-plum px-5 py-2.5 font-semibold text-white">Áp dụng</button>
        </noscript>
      </form>
    )
  return (
    <>
      <button type="button" onClick={() => dialog.current?.showModal()} className="rounded-chip px-5 py-2.5 font-semibold shadow-[inset_0_0_0_1.5px_var(--sn-ink)] lg:hidden">
        Bộ lọc
      </button>
      <dialog ref={dialog} aria-label="Bộ lọc" className="m-0 h-dvh max-h-none w-screen max-w-none bg-bg p-5 text-ink">
        <form action={action}>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Bộ lọc</h2>
            <button type="button" onClick={() => dialog.current?.close()} aria-label="Đóng" className="grid size-10 place-items-center rounded-full hover:bg-linen">
              <CloseIcon className="size-5" />
            </button>
          </div>
          {fields}
          <button className="mt-[18px] w-full rounded-chip bg-plum px-6 py-[13px] font-semibold text-white">Áp dụng bộ lọc</button>
          <p className="mt-2 text-center text-xs text-muted">Hiện có {total} sản phẩm với bộ lọc hiện tại</p>
        </form>
      </dialog>
    </>
  )
}

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="mt-5">
      <legend className="mb-2 text-sm font-bold">{title}</legend>
      {children}
    </fieldset>
  )
}

export function SortSelect({ action, hidden, value }: { action: string; hidden: Record<string, string | undefined>; value: string }) {
  return (
    <form action={action}>
      {Object.entries(hidden).map(([k, v]) => (v && k !== 'sort' && k !== 'page' ? <input key={k} type="hidden" name={k} value={v} /> : null))}
      <label className="sr-only" htmlFor="sort">Sắp xếp</label>
      <select id="sort" name="sort" defaultValue={value} onChange={(e) => e.currentTarget.form?.requestSubmit()} className="rounded-[14px] border-[1.5px] border-line bg-card px-[15px] py-2.5">
        {SORTS.map(([k, l]) => (
          <option key={k} value={k}>{l}</option>
        ))}
      </select>
      <noscript><button className="ml-2 underline">Sắp xếp</button></noscript>
    </form>
  )
}
