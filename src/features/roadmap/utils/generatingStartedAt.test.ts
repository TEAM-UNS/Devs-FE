import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  clearGeneratingStartedAt,
  loadGeneratingStartedAt,
} from './generatingStartedAt'

describe('generatingStartedAt', () => {
  afterEach(() => {
    vi.useRealTimers()
    localStorage.clear()
  })

  it('처음 부르면 지금을 저장하고, 다시 부르면 저장한 시각을 준다', () => {
    vi.useFakeTimers({ now: 1_000 })
    expect(loadGeneratingStartedAt(7)).toBe(1_000)

    vi.setSystemTime(5_000)
    expect(loadGeneratingStartedAt(7)).toBe(1_000)
  })

  it('지우면 다음에는 새로 잰다', () => {
    vi.useFakeTimers({ now: 1_000 })
    loadGeneratingStartedAt(7)
    clearGeneratingStartedAt(7)

    vi.setSystemTime(5_000)
    expect(loadGeneratingStartedAt(7)).toBe(5_000)
  })
})
