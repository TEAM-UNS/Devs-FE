import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useLogout } from './useLogout'

const mocks = vi.hoisted(() => ({
  logout: vi.fn(),
  clearTokens: vi.fn(),
  resetAnalytics: vi.fn(),
  navigate: vi.fn(),
}))

vi.mock('@/shared/api', () => ({
  logout: mocks.logout,
  clearTokens: mocks.clearTokens,
}))
vi.mock('@/shared/analytics', () => ({ resetAnalytics: mocks.resetAnalytics }))
vi.mock('react-router-dom', () => ({ useNavigate: () => mocks.navigate }))

function renderLogout() {
  const queryClient = new QueryClient()
  queryClient.setQueryData(['user', 'me'], { name: '이전 사용자' })
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
  const { result } = renderHook(() => useLogout(), { wrapper })

  return { queryClient, result }
}

describe('useLogout', () => {
  beforeEach(() => vi.clearAllMocks())

  it('서버가 로그아웃에 성공하면 토큰·캐시·분석 식별을 지우고 로그인 화면으로 기록을 덮어쓰며 보낸다', async () => {
    mocks.logout.mockResolvedValueOnce(undefined)
    const { queryClient, result } = renderLogout()

    result.current.mutate()

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(mocks.clearTokens).toHaveBeenCalled()
    expect(queryClient.getQueryData(['user', 'me'])).toBeUndefined()
    expect(mocks.resetAnalytics).toHaveBeenCalled()
    expect(mocks.navigate).toHaveBeenCalledWith('/login', { replace: true })
  })

  it('서버 로그아웃이 실패하면 로그인 상태를 그대로 둔다', async () => {
    mocks.logout.mockRejectedValueOnce(new Error('서버 오류'))
    const { queryClient, result } = renderLogout()

    result.current.mutate()

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(mocks.clearTokens).not.toHaveBeenCalled()
    expect(queryClient.getQueryData(['user', 'me'])).toEqual({
      name: '이전 사용자',
    })
    expect(mocks.navigate).not.toHaveBeenCalled()
  })
})
