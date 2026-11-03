import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { LoginRequired } from './LoginRequired'

const { trackEvent } = vi.hoisted(() => ({ trackEvent: vi.fn() }))
// PageTitle이 페이지 조회를 보낸다
vi.mock('@/shared/analytics', () => ({ trackEvent, trackPageView: vi.fn() }))

describe('LoginRequired', () => {
  it('시작하기를 누르면 어느 화면에서 넘어왔는지 기록한다', async () => {
    render(
      <MemoryRouter initialEntries={['/roadmap']}>
        <LoginRequired title="로드맵" message="안내" background="" />
      </MemoryRouter>,
    )

    await userEvent.click(screen.getByRole('link', { name: 'Devs 시작하기' }))

    expect(trackEvent).toHaveBeenCalledWith('Login Required CTA Clicked', {
      page_path: '/roadmap',
    })
  })
})
