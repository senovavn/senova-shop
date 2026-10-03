import { describe, expect, it } from 'vitest'
import vi from './messages/vi.json'
import en from './messages/en.json'
import { t } from './t'

const shape = (o: object): string[] =>
  Object.entries(o).flatMap(([k, v]) => (typeof v === 'string' ? [k] : shape(v).map((s) => `${k}.${s}`)))

describe('t', () => {
  it('fills placeholders', () => {
    expect(t('home.countdown', { days: 16, occasion: '20/10' })).toBe('Còn 16 ngày tới 20/10')
  })
  it('keeps en.json in the same shape as vi.json', () => {
    expect(shape(en).sort()).toEqual(shape(vi).sort())
  })
})
