import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AxiosError, type AxiosResponse } from 'axios'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { Roadmap, RoadmapStatusResponse } from '@/features/roadmap/types'
import { renderWithQuery } from '@/test/renderWithQuery'
import RoadmapPage from './RoadmapPage'

/* 메모리 위의 가짜 서버. 조회 응답을 테스트마다 갈아 끼운다 */
const server = vi.hoisted(() => ({
  roadmaps: [] as (Roadmap | null)[],
  status: null as RoadmapStatusResponse | null,
}))

const { patch } = vi.hoisted(() => ({ patch: vi.fn() }))

vi.mock('@/shared/analytics', () => ({
  trackEvent: vi.fn(),
  trackPageView: vi.fn(),
}))

const notFound = () =>
  new AxiosError('not found', 'ERR_BAD_REQUEST', undefined, undefined, {
    status: 404,
    data: { message: '로드맵을 찾을 수 없습니다.' },
  } as AxiosResponse)

vi.mock('@/shared/api/http', () => ({
  get: vi.fn((path: string) => {
    if (path === '/user/my') return Promise.resolve({ name: '김데브' })
    if (path === '/roadmap') {
      // 부를 때마다 다음 응답으로 넘어가고, 마지막 응답은 계속 준다
      const next =
        server.roadmaps.length > 1
          ? server.roadmaps.shift()
          : server.roadmaps[0]
      return next ? Promise.resolve(next) : Promise.reject(notFound())
    }
    if (path.endsWith('/status')) return Promise.resolve(server.status)
    return Promise.reject(notFound())
  }),
  post: vi.fn(),
  patch,
}))

const completed: Roadmap = {
  roadmapId: 7,
  status: 'completed',
  fieldName: '프론트엔드',
  summary: '요약',
  learningRate: 0,
  days: [
    {
      dayNo: 1,
      weekNo: 1,
      locked: false,
      allItemsDone: false,
      completed: false,
      retrospect: null,
      items: [
        { itemId: 11, title: 'JSX 학습', description: null, done: false },
      ],
    },
  ],
}

const generating: Roadmap = {
  ...completed,
  status: 'generating',
  learningRate: 0,
  days: [],
}

function renderPage() {
  return renderWithQuery(
    <MemoryRouter initialEntries={['/roadmap']}>
      <Routes>
        <Route path="/roadmap" element={<RoadmapPage />} />
        <Route path="/roadmap/new" element={<p>생성 흐름</p>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('RoadmapPage', () => {
  beforeEach(() => {
    server.roadmaps = []
    server.status = null
    patch.mockReset()
  })

  it('로드맵이 없으면(404) 생성 흐름으로 보낸다', async () => {
    renderPage()

    expect(await screen.findByText('생성 흐름')).toBeInTheDocument()
  })

  it('만드는 중이던 로드맵이 다 만들어지면 상세로 넘어간다', async () => {
    server.roadmaps = [generating, completed]
    server.status = {
      roadmapId: 7,
      status: 'completed',
      generatedWeeks: 1,
      targetWeeks: 1,
      progress: 100,
      errorMessage: null,
    }
    renderPage()

    expect(
      await screen.findByRole('heading', {
        name: '김데브의 프론트엔드 로드맵',
      }),
    ).toBeInTheDocument()
  })

  it('만들기에 실패했으면 서버 안내와 다시 만들기를 보여준다', async () => {
    server.roadmaps = [{ ...generating, status: 'failed' }]
    server.status = {
      roadmapId: 7,
      status: 'failed',
      generatedWeeks: 0,
      targetWeeks: 1,
      progress: 0,
      errorMessage: '로드맵 생성 요청에 실패했습니다.',
    }
    renderPage()

    expect(
      await screen.findByText('로드맵 생성 요청에 실패했습니다.'),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '다시 만들기' })).toHaveAttribute(
      'href',
      '/roadmap/new',
    )
  })

  it('항목을 체크하면 응답의 완료 여부·학습률로 화면을 바꾼다', async () => {
    server.roadmaps = [completed]
    patch.mockResolvedValue({
      itemId: 11,
      done: true,
      dayAllItemsDone: true,
      learningRate: 100,
    })
    renderPage()

    await userEvent.click(
      await screen.findByRole('checkbox', { name: 'JSX 학습' }),
    )

    expect(patch).toHaveBeenCalledWith('/roadmap/items/11', { done: true })
    expect(
      await screen.findByRole('button', { name: '로드맵 완료' }),
    ).toBeInTheDocument()
    await waitFor(() =>
      expect(
        screen.getByRole('progressbar', { name: '현재 학습률' }),
      ).toHaveAttribute('aria-valuenow', '100'),
    )
    expect(screen.getByRole('checkbox', { name: 'JSX 학습' })).toBeChecked()
  })
})
