import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useCountdown } from './useCountdown'

describe('useCountdown', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('start로 시작하면 매초 남은 시간이 1씩 줄어든다', () => {
    vi.useFakeTimers()
    const { result } = renderHook(() => useCountdown())

    act(() => result.current.start(3))
    expect(result.current.secondsLeft).toBe(3)

    act(() => vi.advanceTimersByTime(1000))
    expect(result.current.secondsLeft).toBe(2)

    act(() => vi.advanceTimersByTime(1000))
    expect(result.current.secondsLeft).toBe(1)
  })

  it('0에 도달하면 더 이상 줄지 않고 멈춘다', () => {
    vi.useFakeTimers()
    const { result } = renderHook(() => useCountdown())

    act(() => result.current.start(1))
    act(() => vi.advanceTimersByTime(5000))

    expect(result.current.secondsLeft).toBe(0)
  })
})
