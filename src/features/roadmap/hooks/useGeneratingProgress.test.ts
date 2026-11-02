import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useGeneratingProgress } from './useGeneratingProgress'

describe('useGeneratingProgress', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('서버가 0만 줘도 시간이 지나면 오르고, 완료되면 100까지 채운다', () => {
    const { result, rerender } = renderHook(
      ({ completed }) => useGeneratingProgress(0, completed),
      { initialProps: { completed: false } },
    )
    expect(result.current).toBe(0)

    act(() => vi.advanceTimersByTime(120_000))
    expect(result.current).toBeGreaterThanOrEqual(84)
    expect(result.current).toBeLessThan(90)

    rerender({ completed: true })
    act(() => vi.advanceTimersByTime(2_000))
    expect(result.current).toBe(100)
  })

  it('서버 값이 뛰면 한 번에 뛰지 않고 이어서 오른다', () => {
    const { result, rerender } = renderHook(
      ({ server }) => useGeneratingProgress(server, false),
      { initialProps: { server: 0 } },
    )

    rerender({ server: 50 })
    act(() => vi.advanceTimersByTime(100))
    expect(result.current).toBeGreaterThan(0)
    expect(result.current).toBeLessThan(50)

    act(() => vi.advanceTimersByTime(3_000))
    expect(result.current).toBe(50)
  })
})
