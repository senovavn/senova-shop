import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Logo } from './Logo'

describe('Logo', () => {
  it('gives each instance its own mask id and follows currentColor', () => {
    const { container } = render(<><Logo uid="a" /><Logo uid="b" /></>)
    const ids = [...container.querySelectorAll('mask')].map((m) => m.id)
    expect(ids).toEqual(['senova-logo-a', 'senova-logo-b'])
    expect(container.innerHTML).not.toContain('#5A2A4F')
    expect(container.innerHTML).toContain('currentColor')
  })
})
