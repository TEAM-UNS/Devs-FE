import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { PrivacyPolicy } from '../PrivacyPolicy'
import { TermsOfService } from '../TermsOfService'

function renderWithRouter(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>)
}

describe('법률 문서', () => {
  // jsdom에는 스크롤이 없다
  beforeEach(() => {
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
  })

  it('열면 맨 위부터 보이게 스크롤을 올린다', () => {
    renderWithRouter(<PrivacyPolicy />)

    expect(window.scrollTo).toHaveBeenCalledWith(0, 0)
  })

  it('개인정보 처리방침은 제1조부터 제12조까지 조 제목을 그린다', () => {
    renderWithRouter(<PrivacyPolicy />)

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'UNS(Devs) 개인정보 처리방침',
      }),
    ).toBeInTheDocument()
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(12)
  })

  it('이용약관은 제17조와 부칙까지 그리고, 방침으로 가는 링크가 있다', () => {
    renderWithRouter(<TermsOfService />)

    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(18)
    expect(
      screen.getByRole('link', { name: '「개인정보 처리방침」' }),
    ).toHaveAttribute('href', '/privacy')
  })
})
