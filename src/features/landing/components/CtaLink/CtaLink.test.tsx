import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { CtaLink } from './CtaLink'

const { trackEvent } = vi.hoisted(() => ({ trackEvent: vi.fn() }))
vi.mock('@/shared/analytics', () => ({ trackEvent }))

describe('CtaLink', () => {
  beforeEach(() => trackEvent.mockReset())

  it('누르면 어느 버튼이 어느 자리에서 눌렸는지 기록한다', async () => {
    render(
      <MemoryRouter>
        <CtaLink cta="signup" location="hero">
          무료로 시작하기
        </CtaLink>
      </MemoryRouter>,
    )

    await userEvent.click(screen.getByRole('link', { name: '무료로 시작하기' }))

    expect(trackEvent).toHaveBeenCalledWith('Landing CTA Clicked', {
      cta: 'signup',
      location: 'hero',
    })
  })

  it('버튼이 아니라 해당 경로로 가는 링크다', () => {
    render(
      <MemoryRouter>
        <CtaLink cta="login" location="header">
          로그인
        </CtaLink>
      </MemoryRouter>,
    )

    expect(screen.getByRole('link', { name: '로그인' })).toHaveAttribute(
      'href',
      '/login',
    )
  })
})
