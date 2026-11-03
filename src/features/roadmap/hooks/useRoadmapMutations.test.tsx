import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { useCreateRoadmap } from './useRoadmapMutations'

const { trackEvent } = vi.hoisted(() => ({ trackEvent: vi.fn() }))
vi.mock('@/shared/analytics', () => ({ trackEvent }))
vi.mock('../api/requests', async (importOriginal) => ({
  ...(await importOriginal<object>()),
  createRoadmap: vi.fn().mockResolvedValue({ roadmapId: 1, status: 'pending' }),
}))

function wrapper({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={new QueryClient()}>
      {children}
    </QueryClientProvider>
  )
}

describe('useCreateRoadmap', () => {
  it('만들기에 성공하면 기간과 스택 개수를 기록한다', async () => {
    const { result } = renderHook(() => useCreateRoadmap(), { wrapper })

    await act(() =>
      result.current.mutateAsync({
        majorId: 1,
        skillIds: [1, 2],
        targetWeeks: 4,
      }),
    )

    expect(trackEvent).toHaveBeenCalledWith('Roadmap Created', {
      target_weeks: 4,
      skill_count: 2,
    })
  })
})
