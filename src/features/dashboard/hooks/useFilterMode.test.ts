import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useFilterMode } from './useFilterMode'

const mocks = vi.hoisted(() => ({
  flagsEnabled: vi.fn(),
  fetchFlag: vi.fn(),
  readCachedFlag: vi.fn(),
}))
vi.mock('@/shared/analytics', () => mocks)

describe('useFilterMode', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.flagsEnabled.mockReturnValue(true)
    mocks.readCachedFlag.mockReturnValue(null)
    mocks.fetchFlag.mockResolvedValue(undefined)
  })

  it('Amplitude를 켜지 않는 환경이면 기다리지 않고 바로 기본 모드', () => {
    mocks.flagsEnabled.mockReturnValue(false)
    const { result } = renderHook(() => useFilterMode())

    expect(result.current).toEqual({
      mode: 'default',
      flagSource: 'none',
      flagLatencyMs: null,
    })
    expect(mocks.fetchFlag).not.toHaveBeenCalled()
  })

  it('지난 값이 있으면 기다리지 않고 그 값으로 정하고, 최신 값은 뒤에서 받아 둔다', () => {
    mocks.readCachedFlag.mockReturnValue('on')
    const { result } = renderHook(() => useFilterMode())

    expect(result.current).toEqual({
      mode: 'remember',
      flagSource: 'cache',
      flagLatencyMs: null,
    })
    expect(mocks.fetchFlag).toHaveBeenCalledWith(
      'dashboard-filter-memory',
      10_000,
    )
  })

  it('지난 값이 없으면 최대 500ms 기다려 받은 값으로 정한다', async () => {
    mocks.fetchFlag.mockResolvedValueOnce('on')
    const on = renderHook(() => useFilterMode())
    expect(on.result.current.mode).toBe('pending')
    await waitFor(() => expect(on.result.current.mode).toBe('remember'))
    expect(on.result.current.flagSource).toBe('live')
    expect(on.result.current.flagLatencyMs).toEqual(expect.any(Number))

    mocks.fetchFlag.mockResolvedValueOnce('off')
    const off = renderHook(() => useFilterMode())
    await waitFor(() => expect(off.result.current.mode).toBe('default'))

    expect(mocks.fetchFlag).toHaveBeenCalledWith('dashboard-filter-memory', 500)
  })

  it('시간 안에 못 받으면 fallback', async () => {
    mocks.fetchFlag.mockResolvedValueOnce(null)
    const { result } = renderHook(() => useFilterMode())

    await waitFor(() => expect(result.current.mode).toBe('fallback'))
    expect(result.current.flagSource).toBe('timeout')
  })
})
