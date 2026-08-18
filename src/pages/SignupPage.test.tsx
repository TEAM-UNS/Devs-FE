import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { renderWithQuery } from '@/test/renderWithQuery'
import SignupPage from './SignupPage'

// 1단계가 발송·검증 API를 부른다. 여기서 보는 건 단계 전환이므로 성공 응답으로 대체한다.
vi.mock('@/features/auth/api', () => ({
  sendEmailCode: vi.fn(() => Promise.resolve({ message: 'sent' })),
  verifyEmail: vi.fn(() => Promise.resolve({ message: 'verified' })),
  signup: vi.fn(),
}))

/** 라우터 컨텍스트(로그인 링크)와 QueryClient가 모두 필요하다. */
function renderPage() {
  return renderWithQuery(
    <MemoryRouter>
      <SignupPage />
    </MemoryRouter>,
  )
}

/** 1단계(이메일 인증)를 통과해 2단계로 넘어간다. */
async function passStep1() {
  await userEvent.type(screen.getByLabelText('이메일'), 'user@uns.dev')
  await userEvent.click(screen.getByRole('button', { name: '이메일 인증' }))
  await screen.findByText('3:00')
  await userEvent.type(screen.getByLabelText('이메일 인증'), '123456')
  await userEvent.click(screen.getByRole('button', { name: /다음/ }))
  await screen.findByLabelText('이름')
}

describe('SignupPage', () => {
  it('진행 표시·헤더·1단계 폼·소셜 로그인·로그인 링크를 렌더링한다', () => {
    renderPage()

    expect(screen.getByText('UNS에 오신 것을 환영해요!')).toBeInTheDocument()
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
    // 1단계(이메일 인증) 폼
    expect(screen.getByLabelText('이메일')).toBeInTheDocument()
    // 소셜 로그인
    expect(screen.getByRole('button', { name: /Google/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Github/ })).toBeInTheDocument()
    // 로그인 링크
    expect(screen.getByRole('link', { name: '로그인' })).toHaveAttribute(
      'href',
      '/login',
    )
  })

  it('1단계는 progressbar의 현재 값이 1이다', () => {
    renderPage()

    expect(screen.getByRole('progressbar')).toHaveAttribute(
      'aria-valuenow',
      '1',
    )
  })

  it('1단계를 통과하면 2단계로 진행한다', async () => {
    renderPage()

    await passStep1()

    expect(screen.getByRole('progressbar')).toHaveAttribute(
      'aria-valuenow',
      '2',
    )
  })

  it('2단계로 넘어가면 간편로그인(소셜)은 사라지고 로그인 링크는 유지된다', async () => {
    renderPage()

    // 진입 지점(1단계)에서는 간편로그인이 보인다
    expect(screen.getByRole('button', { name: /Google/ })).toBeInTheDocument()

    await passStep1()

    // 소셜 로그인은 사라지고
    expect(
      screen.queryByRole('button', { name: /Google/ }),
    ).not.toBeInTheDocument()
    // 로그인 링크는 전 단계 공통으로 유지된다
    expect(screen.getByRole('link', { name: '로그인' })).toBeInTheDocument()
  })
})
