import { describe, expect, it } from 'vitest'
import { clampWeeks, slotOf, spinDuration } from './weekWheel'

describe('clampWeeks', () => {
  it('1~12주 밖은 끝값으로 자른다', () => {
    expect(clampWeeks(0)).toBe(1)
    expect(clampWeeks(13)).toBe(12)
    expect(clampWeeks(5)).toBe(5)
  })
})

describe('slotOf', () => {
  it('위 1칸·현재·아래 2칸만 보인다', () => {
    expect([-2, -1, 0, 1, 2, 3].map((d) => slotOf(d).visible)).toEqual([
      false,
      true,
      true,
      true,
      true,
      false,
    ])
  })

  it('가운데에서 멀수록 작아지고 위아래로 대칭이다', () => {
    expect(slotOf(0).scale).toBe(1)
    expect(slotOf(1).scale).toBe(0.5)
    expect(slotOf(2).scale).toBeCloseTo(1 / 3)
    expect(slotOf(-1).y).toBe(-slotOf(1).y)
    expect(slotOf(3).y).toBeGreaterThan(slotOf(2).y)
  })
})

describe('spinDuration', () => {
  it('많이 넘길수록 오래 돌되 상한이 있다', () => {
    expect(spinDuration(1)).toBeLessThan(spinDuration(4))
    expect(spinDuration(11)).toBe(600)
  })
})
