import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import LoginPage from './LoginPage'

/** 라우터 컨텍스트(회원가입 링크)가 필요하므로 MemoryRouter로 감싼다. */
function renderPage() {
  return render(
    <MemoryRouter>
      <LoginPage />
    </MemoryRouter>,
  )
}

describe('LoginPage', () => {
  it('헤더·로그인 폼·간편로그인·회원가입 링크를 렌더링한다', () => {
    renderPage()

    expect(screen.getByText('다시 만나서 반가워요!')).toBeInTheDocument()
    expect(screen.getByLabelText('이메일')).toBeInTheDocument()
    expect(screen.getByLabelText('비밀번호')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '로그인' })).toBeInTheDocument()
    expect(screen.getByText('간편로그인')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Google/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Github/ })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '회원가입' })).toHaveAttribute(
      'href',
      '/signup',
    )
  })

  it('회원가입과 달리 단계 표시(progressbar)가 없다', () => {
    renderPage()

    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
  })
})
