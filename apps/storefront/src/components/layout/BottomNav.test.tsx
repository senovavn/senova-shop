import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { BottomNav } from './BottomNav'
import { OPEN_MENU_EVENT } from './MobileMenu'

const pathname = vi.hoisted(() => ({ value: '/' }))
vi.mock('next/navigation', () => ({ usePathname: () => pathname.value }))

describe('BottomNav', () => {
  it('shows the five tabs with the gift finder in the middle', () => {
    render(<BottomNav />)
    const labels = screen.getAllByRole('link').map((a) => a.textContent)
    expect(labels).toEqual(['Trang chủ', 'Tìm quà', 'Giỏ hàng', 'Tài khoản'])
    expect(screen.getByRole('button', { name: 'Danh mục' })).toBeInTheDocument()
  })

  it('marks the current section', () => {
    pathname.value = '/account/orders'
    render(<BottomNav />)
    expect(screen.getByRole('link', { name: 'Tài khoản' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'Trang chủ' })).not.toHaveAttribute('aria-current')
  })

  it('opens the category menu', async () => {
    const onOpen = vi.fn()
    window.addEventListener(OPEN_MENU_EVENT, onOpen)
    render(<BottomNav />)
    await userEvent.click(screen.getByRole('button', { name: 'Danh mục' }))
    expect(onOpen).toHaveBeenCalledTimes(1)
  })
})
