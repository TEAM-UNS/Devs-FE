import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { AppSidebar } from './AppSidebar'

const NAV_LABELS = [
  '메인페이지',
  '주간리포트',
  '기업 스택 비교',
  '로드맵',
  '익명 회고 게시판',
  'AI 챗봇',
  '마이페이지',
]

/** NavLink가 라우터 컨텍스트를 요구하므로 MemoryRouter로 감싼다. */
function renderSidebar(pathname = '/', progress: number | null = 64) {
  return render(
    <MemoryRouter initialEntries={[pathname]}>
      <AppSidebar roadmapProgress={progress} />
    </MemoryRouter>,
  )
}

describe('AppSidebar', () => {
  it('로고와 네비게이션 7개를 렌더링한다', () => {
    renderSidebar()

    expect(screen.getByAltText('Devs')).toBeInTheDocument()
    for (const label of NAV_LABELS) {
      expect(screen.getByText(label)).toBeInTheDocument()
    }
  })

  it('로드맵은 로드맵 화면으로 가는 링크다', () => {
    renderSidebar()

    expect(screen.getByRole('link', { name: '로드맵' })).toHaveAttribute(
      'href',
      '/roadmap',
    )
  })

  it('기업 스택 비교는 비교 화면으로 가는 링크다', () => {
    renderSidebar()

    expect(
      screen.getByRole('link', { name: '기업 스택 비교' }),
    ).toHaveAttribute('href', '/stack-compare')
  })

  it('AI 챗봇은 챗봇 화면으로 가는 링크다', () => {
    renderSidebar()

    expect(screen.getByRole('link', { name: 'AI 챗봇' })).toHaveAttribute(
      'href',
      '/chat',
    )
  })

  it('현재 경로의 항목만 aria-current를 갖는다', () => {
    renderSidebar('/weekly-report')

    expect(screen.getByRole('link', { name: '주간리포트' })).toHaveAttribute(
      'aria-current',
      'page',
    )
    expect(
      screen.getByRole('link', { name: '메인페이지' }),
    ).not.toHaveAttribute('aria-current')
  })

  it.each([
    ['/roadmap/new', '로드맵'],
    ['/stack-compare/result', '기업 스택 비교'],
    ['/my/retrospects', '마이페이지'],
  ])('하위 경로 %s 에서도 %s 메뉴가 켜진다', (pathname, label) => {
    // 로드맵이 없으면 /roadmap에서 /roadmap/new로 보내져서, 정확히 일치만 보면 메뉴가 꺼졌다
    renderSidebar(pathname)

    expect(screen.getByRole('link', { name: label })).toHaveAttribute(
      'aria-current',
      'page',
    )
  })

  it('로드맵 진행도를 progressbar와 퍼센트 문구로 함께 노출한다', () => {
    renderSidebar('/', 37)

    const bar = screen.getByRole('progressbar', { name: '로드맵 진행도' })
    expect(bar).toHaveAttribute('aria-valuenow', '37')
    expect(screen.getByText('37%')).toBeInTheDocument()
  })

  it('비로그인이면 진행도 대신 로그인 링크를 보여준다', () => {
    renderSidebar('/roadmap', null)

    expect(
      screen.queryByRole('progressbar', { name: '로드맵 진행도' }),
    ).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: '로그인' })).toHaveAttribute(
      'href',
      '/login',
    )
  })
})
