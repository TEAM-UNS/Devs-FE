import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { useLogout } from './useLogout'

const mocks = vi.hoisted(() => ({
  clearTokens: vi.fn(),
  resetAnalytics: vi.fn(),
  navigate: vi.fn(),
}))

vi.mock('@/shared/api', () => ({ clearTokens: mocks.clearTokens }))
vi.mock('@/shared/analytics', () => ({ resetAnalytics: mocks.resetAnalytics }))
vi.mock('react-router-dom', () => ({ useNavigate: () => mocks.navigate }))

describe('useLogout', () => {
  it('토큰·캐시·분석 식별을 지우고 로그인 화면으로 기록을 덮어쓰며 보낸다', () => {
    const queryClient = new QueryClient()
    queryClient.setQueryData(['user', 'me'], { name: '이전 사용자' })
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )

    const { result } = renderHook(() => useLogout(), { wrapper })
    result.current()

    expect(mocks.clearTokens).toHaveBeenCalled()
    expect(queryClient.getQueryData(['user', 'me'])).toBeUndefined()
    expect(mocks.resetAnalytics).toHaveBeenCalled()
    expect(mocks.navigate).toHaveBeenCalledWith('/login', { replace: true })
  })
})
