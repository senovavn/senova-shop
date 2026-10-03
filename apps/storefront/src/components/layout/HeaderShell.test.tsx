import { act, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { HeaderShell } from './HeaderShell'

describe('HeaderShell', () => {
  it('flags the header once the page scrolls past 10px', () => {
    render(<HeaderShell>logo</HeaderShell>)
    const header = screen.getByRole('banner')
    expect(header).toHaveAttribute('data-scrolled', 'false')
    act(() => {
      Object.defineProperty(window, 'scrollY', { value: 40, configurable: true })
      window.dispatchEvent(new Event('scroll'))
    })
    expect(header).toHaveAttribute('data-scrolled', 'true')
  })
})
