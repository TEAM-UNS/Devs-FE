import { screen } from '@testing-library/react'
import { AxiosError, type AxiosResponse } from 'axios'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { Roadmap } from '@/features/roadmap/types'
import { renderWithQuery } from '@/test/renderWithQuery'
import RoadmapCreatePage from './RoadmapCreatePage'

const server = vi.hoisted(() => ({ roadmap: null as Roadmap | null }))

vi.mock('@/shared/analytics', () => ({
  trackEvent: vi.fn(),
  trackPageView: vi.fn(),
}))

vi.mock('@/shared/api/http', () => ({
  get: vi.fn((path: string) => {
    if (path === '/majors') return Promise.resolve({ categories: [] })
    if (path === '/roadmap' && server.roadmap) {
      return Promise.resolve(server.roadmap)
    }
    return Promise.reject(
      new AxiosError('not found', 'ERR_BAD_REQUEST', undefined, undefined, {
        status: 404,
        data: {},
      } as AxiosResponse),
    )
  }),
  post: vi.fn(),
  patch: vi.fn(),
}))

const roadmap = (status: Roadmap['status']): Roadmap => ({
  roadmapId: 7,
  status,
  fieldName: '프론트엔드',
  summary: null,
  learningRate: 0,
  days: [],
})

function renderPage() {
  return renderWithQuery(
    <MemoryRouter initialEntries={['/roadmap/new']}>
      <Routes>
        <Route path="/roadmap/new" element={<RoadmapCreatePage />} />
        <Route path="/roadmap" element={<p>내 로드맵</p>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('RoadmapCreatePage', () => {
  beforeEach(() => {
    server.roadmap = null
  })

  it('로드맵이 없으면 1단계부터 시작한다', async () => {
    renderPage()

    expect(
      await screen.findByRole('heading', { name: '목표 직무 설정' }),
    ).toBeInTheDocument()
  })

  it.each(['completed', 'generating'] as const)(
    '%s 로드맵이 있으면 지워지지 않게 내 로드맵으로 보낸다',
    async (status) => {
      server.roadmap = roadmap(status)
      renderPage()

      expect(await screen.findByText('내 로드맵')).toBeInTheDocument()
    },
  )

  it('실패한 로드맵은 다시 만들 수 있다', async () => {
    server.roadmap = roadmap('failed')
    renderPage()

    expect(
      await screen.findByRole('heading', { name: '목표 직무 설정' }),
    ).toBeInTheDocument()
  })
})
