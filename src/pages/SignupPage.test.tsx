import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderWithQuery } from '@/test/renderWithQuery'
import SignupPage from './SignupPage'

const { trackEvent } = vi.hoisted(() => ({ trackEvent: vi.fn() }))
vi.mock('@/shared/analytics', () => ({ trackEvent, trackPageView: vi.fn() }))

// 1단계가 발송·검증 API를 부른다. 여기서 보는 건 단계 전환이므로 성공 응답으로 대체한다.
vi.mock('@/features/auth/api', () => ({
  sendEmailCode: vi.fn(() => Promise.resolve()),
  verifyEmail: vi.fn(() => Promise.resolve()),
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
  await screen.findByText('5:00')
  await userEvent.type(screen.getByLabelText('이메일 인증'), '123456')
  await userEvent.click(screen.getByRole('button', { name: /다음/ }))
  await screen.findByLabelText('이름')
}

describe('SignupPage', () => {
  // 1단계를 통과하면 가입 정보가 sessionStorage에 남는다. 테스트끼리 섞이지 않게 비운다
  beforeEach(() => {
    sessionStorage.clear()
  })

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

  it('단계를 넘어갈 때 이탈 지점을 볼 수 있도록 단계 번호와 함께 이벤트를 남긴다', async () => {
    trackEvent.mockClear()
    renderPage()
    await passStep1()

    expect(trackEvent).toHaveBeenCalledWith('Signup Step Completed', {
      step: 1,
    })
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

  it('새로고침하면 인증을 마친 2단계부터 이름을 채운 채 다시 시작하고, 비밀번호는 남기지 않는다', async () => {
    const { unmount } = renderPage()
    await passStep1()
    await userEvent.type(screen.getByLabelText('이름'), '홍길동')
    await userEvent.type(screen.getByLabelText('비밀번호'), 'secure7Pass')
    await userEvent.type(screen.getByLabelText('비밀번호 확인'), 'secure7Pass')
    await userEvent.click(screen.getByRole('button', { name: /다음/ }))
    await waitFor(() =>
      expect(screen.getByRole('progressbar')).toHaveAttribute(
        'aria-valuenow',
        '3',
      ),
    )

    // 새로고침: 화면을 내렸다가 다시 그린다
    unmount()
    renderPage()

    expect(screen.getByRole('progressbar')).toHaveAttribute(
      'aria-valuenow',
      '2',
    )
    expect(screen.getByLabelText('이름')).toHaveValue('홍길동')
    expect(screen.getByLabelText('비밀번호')).toHaveValue('')
    expect(JSON.stringify(sessionStorage)).not.toContain('secure7Pass')
  })

  it('인증한 지 30분이 지난 값은 서버가 거절하니 버리고 1단계부터 시작한다', () => {
    sessionStorage.setItem(
      'signup-draft',
      JSON.stringify({
        email: 'user@uns.dev',
        name: '홍길동',
        verifiedAt: Date.now() - 31 * 60 * 1000,
      }),
    )
    renderPage()

    expect(screen.getByRole('progressbar')).toHaveAttribute(
      'aria-valuenow',
      '1',
    )
  })

  it('인증 전이라도 입력하던 이메일은 새로고침 뒤 1단계에 남는다', async () => {
    const { unmount } = renderPage()
    await userEvent.type(screen.getByLabelText('이메일'), 'user@uns.dev')

    unmount()
    renderPage()

    expect(screen.getByRole('progressbar')).toHaveAttribute(
      'aria-valuenow',
      '1',
    )
    expect(screen.getByLabelText('이메일')).toHaveValue('user@uns.dev')
  })
})
