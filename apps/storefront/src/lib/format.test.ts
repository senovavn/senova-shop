import { describe, expect, it } from 'vitest'
import { formatVnd } from './format'

describe('formatVnd', () => {
  it('uses dot thousands separators and a trailing ₫', () => {
    expect(formatVnd(149000)).toBe('149.000₫')
    expect(formatVnd(1250000)).toBe('1.250.000₫')
  })
  it('rounds to whole đồng', () => {
    expect(formatVnd(0)).toBe('0₫')
    expect(formatVnd(99999.6)).toBe('100.000₫')
  })
})
