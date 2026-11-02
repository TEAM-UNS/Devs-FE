import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Retrospect } from '@/features/retrospect/types'
import { renderWithQuery } from '@/test/renderWithQuery'
import RetrospectBoardPage from './RetrospectBoardPage'

const server = vi.hoisted(() => ({ retrospects: [] as Retrospect[] }))
const { post, del } = vi.hoisted(() => ({ post: vi.fn(), del: vi.fn() }))

vi.mock('@/shared/analytics', () => ({
  trackEvent: vi.fn(),
  trackPageView: vi.fn(),
}))

vi.mock('@/shared/api/http', () => ({
  get: vi.fn(() => Promise.resolve(server.retrospects)),
  post,
  del,
  patch: vi.fn(),
}))

const retrospect: Retrospect = {
  retrospectId: 7,
  dayNo: 3,
  content: '오늘은 훅을 배웠다',
  date: '2026-11-02',
  likeCount: 1,
  liked: false,
}

function renderPage() {
  return renderWithQuery(
    <MemoryRouter>
      <RetrospectBoardPage />
    </MemoryRouter>,
  )
}

describe('RetrospectBoardPage', () => {
  // jsdom에는 dialog의 showModal이 없다
  beforeAll(() => {
    HTMLDialogElement.prototype.showModal = function showModal() {
      this.open = true
    }
  })

  beforeEach(() => {
    server.retrospects = []
    post.mockReset()
    del.mockReset()
  })

  it('이번 주 회고가 없으면 안내를 보여준다', async () => {
    renderPage()

    expect(
      await screen.findByText('이번 주 회고가 아직 없어요'),
    ).toBeInTheDocument()
  })

  it('좋아요를 누르면 서버가 준 개수로 바뀌고, 다시 누르면 취소한다', async () => {
    server.retrospects = [retrospect]
    post.mockResolvedValue({ retrospectId: 7, likeCount: 2, liked: true })
    del.mockResolvedValue({ retrospectId: 7, likeCount: 1, liked: false })
    renderPage()

    await userEvent.click(
      await screen.findByRole('button', { name: '좋아요 1개' }),
    )
    expect(post).toHaveBeenCalledWith('/like/7')
    const liked = await screen.findByRole('button', { name: '좋아요 2개' })
    expect(liked).toHaveAttribute('aria-pressed', 'true')

    await userEvent.click(liked)
    expect(del).toHaveBeenCalledWith('/like/7')
    await waitFor(() =>
      expect(
        screen.getByRole('button', { name: '좋아요 1개' }),
      ).toHaveAttribute('aria-pressed', 'false'),
    )
  })

  it('상세 모달에서 누른 좋아요도 바로 반영된다', async () => {
    server.retrospects = [retrospect]
    post.mockResolvedValue({ retrospectId: 7, likeCount: 2, liked: true })
    renderPage()

    await userEvent.click(
      await screen.findByRole('button', { name: /회고 보기$/ }),
    )
    const dialog = await screen.findByRole('dialog', { hidden: true })
    await userEvent.click(
      within(dialog).getByRole('button', { name: '좋아요 1개', hidden: true }),
    )

    expect(
      await within(dialog).findByRole('button', {
        name: '좋아요 2개',
        hidden: true,
      }),
    ).toBeInTheDocument()
  })
})
