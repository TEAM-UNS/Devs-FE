import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { RoadmapSummary } from '@/features/roadmap/types'
import { renderWithQuery } from '@/test/renderWithQuery'
import RoadmapPage from './RoadmapPage'

/* 메모리 위의 가짜 서버. 삭제하면 목록에서 빠진다 */
const server = vi.hoisted(() => ({ roadmaps: [] as RoadmapSummary[] }))

const { del } = vi.hoisted(() => ({ del: vi.fn() }))

vi.mock('@/shared/analytics', () => ({
  trackEvent: vi.fn(),
  trackPageView: vi.fn(),
}))

vi.mock('@/shared/api/http', () => ({
  get: vi.fn((path: string) =>
    path === '/roadmap'
      ? Promise.resolve(server.roadmaps)
      : Promise.reject(new Error(`unexpected ${path}`)),
  ),
  del,
  post: vi.fn(),
  patch: vi.fn(),
}))

const summary = (
  roadmapId: number,
  overrides: Partial<RoadmapSummary> = {},
): RoadmapSummary => ({
  roadmapId,
  majorId: 1,
  majorName: '프론트엔드',
  targetWeeks: 4,
  status: 'completed',
  date: '2026-11-01',
  ...overrides,
})

function renderPage() {
  return renderWithQuery(
    <MemoryRouter initialEntries={['/roadmap']}>
      <Routes>
        <Route path="/roadmap" element={<RoadmapPage />} />
        <Route path="/roadmap/:roadmapId" element={<p>로드맵 상세</p>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('RoadmapPage', () => {
  beforeEach(() => {
    server.roadmaps = []
    del.mockReset()
    del.mockImplementation((path: string) => {
      const id = Number(path.split('/').at(-1))
      server.roadmaps = server.roadmaps.filter(
        ({ roadmapId }) => roadmapId !== id,
      )
      return Promise.resolve()
    })
  })

  it('로드맵이 없으면 안내와 새로 만들기만 보여준다', async () => {
    renderPage()

    expect(
      await screen.findByText('아직 만든 로드맵이 없어요'),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: '새 로드맵 만들기' }),
    ).toHaveAttribute('href', '/roadmap/new')
  })

  it('로드맵마다 직무·기간·날짜를 보여주고, 다 만들지 않은 것은 상태를 붙인다', async () => {
    server.roadmaps = [
      summary(1),
      summary(2, { majorName: '백엔드', targetWeeks: 8, status: 'generating' }),
      summary(3, { majorName: '데이터', status: 'failed', date: '2026-11-05' }),
    ]
    renderPage()

    expect(
      await screen.findByRole('heading', { name: '프론트엔드 로드맵' }),
    ).toBeInTheDocument()
    expect(screen.getByText('4주 · 2026.11.01')).toBeInTheDocument()
    expect(screen.getByText('만드는 중')).toBeInTheDocument()
    expect(screen.getByText('만들기 실패')).toBeInTheDocument()
  })

  it('카드를 누르면 그 로드맵 상세로 간다', async () => {
    server.roadmaps = [summary(7)]
    renderPage()

    await userEvent.click(
      await screen.findByRole('link', { name: '프론트엔드 로드맵 열기' }),
    )

    expect(await screen.findByText('로드맵 상세')).toBeInTheDocument()
  })

  it('삭제는 한 번 확인받고, 지우면 목록에서 빠진다', async () => {
    server.roadmaps = [summary(1), summary(2, { majorName: '백엔드' })]
    renderPage()

    await userEvent.click(
      await screen.findByRole('button', { name: '백엔드 로드맵 삭제' }),
    )
    const dialog = screen.getByRole('dialog', {
      name: '백엔드 로드맵을 삭제할까요?',
    })
    await userEvent.click(within(dialog).getByRole('button', { name: '삭제' }))

    expect(del).toHaveBeenCalledWith('/roadmap/2')
    await waitFor(() =>
      expect(
        screen.queryByRole('heading', { name: '백엔드 로드맵' }),
      ).not.toBeInTheDocument(),
    )
    expect(
      screen.getByRole('heading', { name: '프론트엔드 로드맵' }),
    ).toBeInTheDocument()
  })

  it('앞 삭제가 끝나도 그사이 연 다른 로드맵의 확인 창은 닫지 않는다', async () => {
    server.roadmaps = [summary(1), summary(2, { majorName: '백엔드' })]
    let finish = () => {}
    // 백엔드 삭제 응답을 붙잡아 두었다가 다른 창을 연 뒤에 끝낸다
    del.mockImplementationOnce(
      () =>
        new Promise<void>((resolve) => {
          finish = () => {
            server.roadmaps = server.roadmaps.filter(
              ({ roadmapId }) => roadmapId !== 2,
            )
            resolve()
          }
        }),
    )
    renderPage()

    await userEvent.click(
      await screen.findByRole('button', { name: '백엔드 로드맵 삭제' }),
    )
    await userEvent.click(screen.getByRole('button', { name: '삭제' }))
    await userEvent.click(screen.getByRole('button', { name: '취소' }))
    await userEvent.click(
      screen.getByRole('button', { name: '프론트엔드 로드맵 삭제' }),
    )
    finish()

    // 앞 요청이 끝나 목록에서 빠질 때까지 기다린 뒤에도 지금 창은 그대로다
    await waitFor(() =>
      expect(
        screen.queryByRole('heading', { name: '백엔드 로드맵' }),
      ).not.toBeInTheDocument(),
    )
    expect(
      screen.getByRole('dialog', { name: '프론트엔드 로드맵을 삭제할까요?' }),
    ).toBeInTheDocument()
  })

  it('확인 창에서 취소하면 지우지 않는다', async () => {
    server.roadmaps = [summary(1)]
    renderPage()

    await userEvent.click(
      await screen.findByRole('button', { name: '프론트엔드 로드맵 삭제' }),
    )
    await userEvent.click(screen.getByRole('button', { name: '취소' }))

    expect(del).not.toHaveBeenCalled()
  })
})
