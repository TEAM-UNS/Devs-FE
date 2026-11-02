import { renderHook } from '@testing-library/react'
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

  it('Amplitude를 켜지 않는 환경이면 기본 모드이고 플래그를 받지 않는다', () => {
    mocks.flagsEnabled.mockReturnValue(false)
    const { result } = renderHook(() => useFilterMode())

    expect(result.current).toEqual({ mode: 'default', flagSource: 'none' })
    expect(mocks.fetchFlag).not.toHaveBeenCalled()
  })

  it('지난 값이 on이면 첫 렌더부터 기억 모드, 그 밖의 값은 기본 모드', () => {
    mocks.readCachedFlag.mockReturnValue('on')
    expect(renderHook(() => useFilterMode()).result.current).toEqual({
      mode: 'remember',
      flagSource: 'cache',
    })

    mocks.readCachedFlag.mockReturnValue(undefined)
    expect(renderHook(() => useFilterMode()).result.current).toEqual({
      mode: 'default',
      flagSource: 'cache',
    })
  })

  it('받은 적이 없으면 기다리지 않고 fallback으로 그리고, 다음 방문을 위해 뒤에서 받아 둔다', () => {
    const { result } = renderHook(() => useFilterMode())

    expect(result.current).toEqual({ mode: 'fallback', flagSource: 'uncached' })
    expect(mocks.fetchFlag).toHaveBeenCalledWith(
      'dashboard-filter-memory',
      10_000,
    )
  })
})
