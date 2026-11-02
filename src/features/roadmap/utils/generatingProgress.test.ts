import { describe, expect, it } from 'vitest'
import {
  estimateProgress,
  followProgress,
  targetProgress,
} from './generatingProgress'

describe('estimateProgress', () => {
  it('0에서 시작해 안내한 2분쯤 85% 근처, 오래 걸려도 90을 넘지 않는다', () => {
    expect(estimateProgress(0)).toBe(0)
    expect(estimateProgress(120_000)).toBeCloseTo(85.5, 0)
    expect(estimateProgress(60 * 60_000)).toBeLessThanOrEqual(90)
  })
})

describe('targetProgress', () => {
  it('서버 값이 추정치보다 크면 서버 값을 쓴다', () => {
    expect(targetProgress(95, 0, false)).toBe(95)
    expect(targetProgress(0, 120_000, false)).toBeCloseTo(85.5, 0)
  })

  it('완료면 100', () => {
    expect(targetProgress(0, 0, true)).toBe(100)
  })
})

describe('followProgress', () => {
  it('목표로 조금씩 다가가고, 가까워지면 목표에 붙는다', () => {
    expect(followProgress(0, 100)).toBe(30)
    expect(followProgress(99.6, 100)).toBe(100)
  })
})
