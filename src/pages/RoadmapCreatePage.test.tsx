import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { renderWithQuery } from '@/test/renderWithQuery'
import RoadmapCreatePage from './RoadmapCreatePage'

vi.mock('@/shared/analytics', () => ({
  trackEvent: vi.fn(),
  trackPageView: vi.fn(),
}))

const { get } = vi.hoisted(() => ({
  get: vi.fn((path: string) =>
    path === '/majors'
      ? Promise.resolve({ categories: [] })
      : Promise.reject(new Error(`unexpected ${path}`)),
  ),
}))

vi.mock('@/shared/api/http', () => ({ get, post: vi.fn(), patch: vi.fn() }))

function renderPage() {
  return renderWithQuery(
    <MemoryRouter initialEntries={['/roadmap/new']}>
      <Routes>
        <Route path="/roadmap/new" element={<RoadmapCreatePage />} />
        <Route path="/roadmap" element={<p>로드맵 목록</p>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('RoadmapCreatePage', () => {
  it('로드맵은 여러 개 가질 수 있어 내 로드맵을 묻지 않고 1단계부터 시작한다', async () => {
    renderPage()

    expect(
      await screen.findByRole('heading', { name: '목표 직무 설정' }),
    ).toBeInTheDocument()
    expect(get).not.toHaveBeenCalledWith('/roadmap')
  })

  it('1단계에서 이전을 누르면 로드맵 목록으로 돌아간다', async () => {
    renderPage()

    await userEvent.click(await screen.findByRole('button', { name: '이전' }))

    expect(await screen.findByText('로드맵 목록')).toBeInTheDocument()
  })
})
