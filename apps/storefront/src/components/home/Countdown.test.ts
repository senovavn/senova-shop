import { describe, expect, it } from 'vitest'
import { remaining } from './Countdown'

describe('remaining', () => {
  const end = '2026-10-04T16:59:59.000Z'
  it('splits into h/m/s', () => {
    expect(remaining(end, Date.parse('2026-10-04T13:28:30Z'))).toEqual({ h: 3, m: 31, s: 29, done: false })
  })
  it('stops at zero', () => {
    expect(remaining(end, Date.parse('2026-10-05T00:00:00Z'))).toEqual({ h: 0, m: 0, s: 0, done: true })
  })
})
