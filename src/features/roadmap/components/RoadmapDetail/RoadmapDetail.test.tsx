import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { renderWithQuery } from '@/test/renderWithQuery'
import type { Roadmap } from '../../types'
import { RoadmapDetail } from './RoadmapDetail'

const { trackEvent } = vi.hoisted(() => ({ trackEvent: vi.fn() }))
vi.mock('@/shared/analytics', () => ({ trackEvent }))
vi.mock('../../utils/celebrate', () => ({ celebrate: vi.fn() }))
// 완료 요청은 바로 성공한 것으로 친다
vi.mock('../../hooks/useRoadmapMutations', () => ({
  useCompleteRoadmapDay: () => ({
    isPending: false,
    mutate: (_: unknown, options: { onSuccess: () => void }) =>
      options.onSuccess(),
  }),
  useCheckRoadmapItem: () => ({ mutate: vi.fn(), isPending: false }),
}))

const roadmap: Roadmap = {
  roadmapId: 1,
  status: 'completed',
  fieldName: '프론트엔드',
  summary: null,
  learningRate: 100,
  days: [
    {
      dayNo: 1,
      weekNo: 1,
      locked: false,
      allItemsDone: true,
      completed: false,
      retrospect: null,
      items: [{ itemId: 1, title: '할 일', description: null, done: true }],
    },
  ],
}

describe('RoadmapDetail 하루 완료 기록', () => {
  it('회고를 쓰고 마치면 며칠째인지·회고 작성 여부·로드맵 완료 여부를 기록한다', async () => {
    renderWithQuery(
      <MemoryRouter>
        <RoadmapDetail roadmap={roadmap} />
      </MemoryRouter>,
    )

    // 마지막 날은 '로드맵 완주'가 완료를 맡는다
    await userEvent.click(screen.getByRole('button', { name: '로드맵 완주' }))
    await userEvent.type(screen.getByLabelText('회고'), '오늘 배운 것')
    await userEvent.click(screen.getByRole('button', { name: '작성완료' }))

    expect(trackEvent).toHaveBeenCalledWith('Roadmap Day Completed', {
      day_no: 1,
      wrote_retrospect: true,
      finished_roadmap: true,
    })
  })
})
