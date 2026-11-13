import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { renderWithQuery } from '@/test/renderWithQuery'
import { routes } from './routes'

vi.mock('@/shared/analytics', () => ({
  trackEvent: vi.fn(),
  trackPageView: vi.fn(),
}))

function renderAt(...entries: string[]) {
  const router = createMemoryRouter(routes, { initialEntries: entries })
  renderWithQuery(<RouterProvider router={router} />)
  return router
}

describe('없는 경로', () => {
  it('사이드바 없이 전체 화면 404를 띄운다', async () => {
    renderAt('/no-such-page')

    expect(
      await screen.findByRole('heading', { name: '404' }),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('link', { name: '메인페이지' }),
    ).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: '메인으로 가기' })).toHaveAttribute(
      'href',
      '/dashboard',
    )
  })

  it('돌아갈 기록이 없으면 이전 페이지로를 눌러도 메인으로 간다', async () => {
    const router = renderAt('/no-such-page')

    await userEvent.click(
      await screen.findByRole('button', { name: '이전 페이지로' }),
    )

    expect(router.state.location.pathname).toBe('/dashboard')
  })
})
