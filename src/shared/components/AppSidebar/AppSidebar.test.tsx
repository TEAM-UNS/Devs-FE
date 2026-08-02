import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { AppSidebar } from './AppSidebar'

const NAV_LABELS = [
  '메인페이지',
  '주간리포트',
  '기업 스택 비교',
  '로드맵',
  'AI 챗봇',
  '마이페이지',
]

/** NavLink가 라우터 컨텍스트를 요구하므로 MemoryRouter로 감싼다. */
function renderSidebar(pathname = '/', progress = 64) {
  return render(
    <MemoryRouter initialEntries={[pathname]}>
      <AppSidebar roadmapProgress={progress} />
    </MemoryRouter>,
  )
}

describe('AppSidebar', () => {
  it('로고와 네비게이션 6개를 렌더링한다', () => {
    renderSidebar()

    expect(screen.getByAltText('UNS')).toBeInTheDocument()
    const links = screen.getAllByRole('link')
    expect(links.map((el) => el.textContent)).toEqual(NAV_LABELS)
  })

  it('현재 경로의 항목만 aria-current를 갖는다', () => {
    renderSidebar('/roadmap')

    expect(screen.getByRole('link', { name: '로드맵' })).toHaveAttribute(
      'aria-current',
      'page',
    )
    expect(
      screen.getByRole('link', { name: '메인페이지' }),
    ).not.toHaveAttribute('aria-current')
  })

  it('메인페이지는 정확히 / 에서만 활성화된다', () => {
    // end 옵션이 없으면 '/'가 모든 하위 경로에 매칭돼 항상 활성으로 보인다.
    renderSidebar('/weekly-report')

    expect(
      screen.getByRole('link', { name: '메인페이지' }),
    ).not.toHaveAttribute('aria-current')
  })

  it('로드맵 진행도를 progressbar와 퍼센트 문구로 함께 노출한다', () => {
    renderSidebar('/', 37)

    const bar = screen.getByRole('progressbar', { name: '로드맵 진행도' })
    expect(bar).toHaveAttribute('aria-valuenow', '37')
    expect(screen.getByText('37%')).toBeInTheDocument()
  })
})
