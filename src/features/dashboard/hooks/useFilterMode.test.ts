import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useFilterMode } from './useFilterMode'

const mocks = vi.hoisted(() => ({
  flagsEnabled: vi.fn(),
  fetchFlag: vi.fn(),
}))
vi.mock('@/shared/analytics', () => mocks)

describe('useFilterMode', () => {
  beforeEach(() => vi.clearAllMocks())

  it('Amplitude를 켜지 않는 환경이면 기다리지 않고 바로 기본 모드', () => {
    mocks.flagsEnabled.mockReturnValue(false)
    const { result } = renderHook(() => useFilterMode())

    expect(result.current).toEqual({ mode: 'default', flagLatencyMs: null })
    expect(mocks.fetchFlag).not.toHaveBeenCalled()
  })

  it('플래그가 on이면 기억 모드, off면 기본 모드', async () => {
    mocks.flagsEnabled.mockReturnValue(true)
    mocks.fetchFlag.mockResolvedValueOnce('on')
    const on = renderHook(() => useFilterMode())
    expect(on.result.current.mode).toBe('pending')
    await waitFor(() => expect(on.result.current.mode).toBe('remember'))
    expect(on.result.current.flagLatencyMs).toEqual(expect.any(Number))

    mocks.fetchFlag.mockResolvedValueOnce('off')
    const off = renderHook(() => useFilterMode())
    await waitFor(() => expect(off.result.current.mode).toBe('default'))

    expect(mocks.fetchFlag).toHaveBeenCalledWith('dashboard-filter-memory', 500)
  })

  it('시간 안에 못 받으면 fallback', async () => {
    mocks.flagsEnabled.mockReturnValue(true)
    mocks.fetchFlag.mockResolvedValueOnce(null)
    const { result } = renderHook(() => useFilterMode())

    await waitFor(() => expect(result.current.mode).toBe('fallback'))
  })
})
