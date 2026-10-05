import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useCountUp } from './useCountUp'

function mockReducedMotion(matches: boolean) {
  window.matchMedia = vi.fn().mockReturnValue({ matches })
}

describe('useCountUp', () => {
  beforeEach(() => {
    vi.useFakeTimers({
      toFake: ['requestAnimationFrame', 'cancelAnimationFrame', 'performance'],
    })
    mockReducedMotion(false)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('시작 전에는 0에 머문다', () => {
    const { result } = renderHook(() => useCountUp(18000, false))

    act(() => vi.advanceTimersByTime(2000))

    expect(result.current).toBe(0)
  })

  it('시작하면 올라가다가 정해진 시간에 목표값에서 멈춘다', () => {
    const { result } = renderHook(() => useCountUp(18000, true, 1500))

    act(() => vi.advanceTimersByTime(500))
    expect(result.current).toBeGreaterThan(0)
    expect(result.current).toBeLessThan(18000)

    act(() => vi.advanceTimersByTime(1500))
    expect(result.current).toBe(18000)
  })

  it('모션을 줄인 사용자에게는 처음부터 목표값을 보여준다', () => {
    mockReducedMotion(true)

    const { result } = renderHook(() => useCountUp(18000, false))

    expect(result.current).toBe(18000)
  })
})
