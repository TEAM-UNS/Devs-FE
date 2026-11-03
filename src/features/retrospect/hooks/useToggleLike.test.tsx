import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { useToggleLike } from './useToggleLike'

const { trackEvent } = vi.hoisted(() => ({ trackEvent: vi.fn() }))
vi.mock('@/shared/analytics', () => ({ trackEvent }))
vi.mock('../api/requests', async (importOriginal) => ({
  ...(await importOriginal<object>()),
  likeRetrospect: vi
    .fn()
    .mockResolvedValue({ retrospectId: 1, likeCount: 1, liked: true }),
  unlikeRetrospect: vi.fn(),
}))

function wrapper({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={new QueryClient()}>
      {children}
    </QueryClientProvider>
  )
}

describe('useToggleLike', () => {
  it('좋아요가 반영되면 누른 결과를 기록한다', async () => {
    const { result } = renderHook(() => useToggleLike(), { wrapper })

    await act(() =>
      result.current.mutateAsync({ retrospectId: 1, liked: false }),
    )

    expect(trackEvent).toHaveBeenCalledWith('Retrospect Liked', { liked: true })
  })
})
