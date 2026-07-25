import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import SignupPage from './SignupPage'

/** 라우터 컨텍스트(로그인 링크)가 필요하므로 MemoryRouter로 감싼다. */
function renderPage() {
  return render(
    <MemoryRouter>
      <SignupPage />
    </MemoryRouter>,
  )
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

    await userEvent.type(screen.getByLabelText('이메일'), 'user@uns.dev')
    await userEvent.click(screen.getByRole('button', { name: '이메일 인증' }))
    await userEvent.type(screen.getByLabelText('이메일 인증'), '123456')
    await userEvent.click(screen.getByRole('button', { name: /다음/ }))

    expect(screen.getByRole('progressbar')).toHaveAttribute(
      'aria-valuenow',
      '2',
    )
  })

  it('2단계부터는 간편로그인·로그인 링크를 노출하지 않는다', async () => {
    renderPage()

    // 진입 지점(1단계)에서는 간편로그인이 보인다
    expect(screen.getByRole('button', { name: /Google/ })).toBeInTheDocument()

    await userEvent.type(screen.getByLabelText('이메일'), 'user@uns.dev')
    await userEvent.click(screen.getByRole('button', { name: '이메일 인증' }))
    await userEvent.type(screen.getByLabelText('이메일 인증'), '123456')
    await userEvent.click(screen.getByRole('button', { name: /다음/ }))

    // 2단계로 넘어가면 간편로그인·로그인 링크는 사라진다
    expect(
      screen.queryByRole('button', { name: /Google/ }),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('link', { name: '로그인' }),
    ).not.toBeInTheDocument()
  })
})
