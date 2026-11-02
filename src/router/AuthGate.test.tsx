import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, describe, expect, it } from 'vitest'
import { clearTokens, setTokens } from '@/shared/api'
import { AuthGate } from './AuthGate'

function renderGate() {
  return render(
    <MemoryRouter initialEntries={['/roadmap/new?step=2']}>
      <Routes>
        <Route element={<AuthGate lock="roadmap" />}>
          <Route path="/roadmap/new" element={<p>로드맵 만들기</p>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  )
}

describe('AuthGate', () => {
  afterEach(() => clearTokens())

  it('로그인했으면 화면을 그대로 보여준다', () => {
    setTokens({ accessToken: 'a', refreshToken: 'r' })
    renderGate()

    expect(screen.getByText('로드맵 만들기')).toBeInTheDocument()
  })

  it('비로그인이면 화면 대신 그 화면의 잠금 안내와 로그인 링크를 보여준다', () => {
    renderGate()

    expect(screen.queryByText('로드맵 만들기')).not.toBeInTheDocument()
    expect(
      screen.getByText('나에게 맞춘 학습 로드맵을 받아보세요!'),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Devs 시작하기' })).toHaveAttribute(
      'href',
      '/login',
    )
  })
})
