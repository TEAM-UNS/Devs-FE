import { describe, expect, it } from 'vitest'
import { parseStep, reachableStep } from './createStep'

describe('parseStep', () => {
  it.each([
    ['?step=3', 3],
    ['?step=4', 4],
    ['', 1],
    ['?step=0', 1],
    ['?step=5', 1],
    ['?step=2.5', 1],
    ['?step=abc', 1],
  ])('%s → %i단계', (search, expected) => {
    expect(parseStep(new URLSearchParams(search))).toBe(expected)
  })
})

describe('reachableStep', () => {
  it('직무를 안 골랐으면 1단계까지만 간다', () => {
    expect(reachableStep(null, 0)).toBe(1)
  })

  it('스택을 안 골랐으면 2단계까지만 간다', () => {
    expect(reachableStep(2, 0)).toBe(2)
  })

  it('직무와 스택을 골랐으면 마지막 단계까지 간다', () => {
    expect(reachableStep(2, 1)).toBe(4)
  })
})
