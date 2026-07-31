import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { DashboardOverview } from './DashboardOverview'
import { DASHBOARD_EMPTY_MOCK, DASHBOARD_MOCK } from './mockDashboard'

const CARD_TITLES = [
  '인기 기술 스택',
  '기업 규모별 기술 스택 분석',
  '급상승 기술 스택',
]

describe('DashboardOverview', () => {
  it('KPI 카드 4장과 차트 카드 3종을 렌더링한다', () => {
    render(<DashboardOverview />)

    expect(screen.getAllByRole('article')).toHaveLength(4)
    for (const title of CARD_TITLES) {
      expect(screen.getByRole('heading', { name: title })).toBeInTheDocument()
    }
  })

  it('데이터가 있으면 KPI 값과 증감 문구를 표시한다', () => {
    render(<DashboardOverview />)

    expect(screen.getByText('189')).toBeInTheDocument()

    // 'React'는 KPI 값·순위·막대 라벨에 모두 나오므로 카드 범위로 좁힌다.
    const mentionCard = screen
      .getByRole('heading', { name: '이번주 최다 언급' })
      .closest('article') as HTMLElement
    expect(within(mentionCard).getByText('React')).toBeInTheDocument()

    // 문구는 노드가 쪼개져 있으므로 느슨하게 매칭한다 (접근성 이름 trim 주의)
    expect(screen.getByText(/전일 대비/)).toHaveTextContent(/-62건/)
    expect(within(mentionCard).getByText(/건에 등장/)).toHaveTextContent(
      /공고 123건에 등장/,
    )
  })

  it('선택된 필터 칩만 aria-pressed가 true다', () => {
    render(<DashboardOverview />)

    const selected = screen
      .getAllByRole('button', { pressed: true })
      .map((el) => el.textContent)

    // 인기 기술 스택의 'FE' + 급상승의 '한 달' 두 개만 선택 상태다
    expect(selected).toEqual([
      DASHBOARD_MOCK.selectedStackFilter,
      DASHBOARD_MOCK.selectedRisingPeriod,
    ])
  })

  it('필터 칩은 단일 선택이다 — 다른 칩을 누르면 앞의 선택이 풀린다', async () => {
    render(<DashboardOverview />)

    const before = screen.getByRole('button', {
      name: DASHBOARD_MOCK.selectedStackFilter,
    })
    expect(before).toHaveAttribute('aria-pressed', 'true')

    await userEvent.click(screen.getByRole('button', { name: 'BE' }))

    expect(screen.getByRole('button', { name: 'BE' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(
      screen.getByRole('button', { name: DASHBOARD_MOCK.selectedStackFilter }),
    ).toHaveAttribute('aria-pressed', 'false')
  })

  it('기간 토글도 단일 선택으로 바뀐다', async () => {
    render(<DashboardOverview />)

    await userEvent.click(screen.getByRole('button', { name: '1주' }))

    expect(screen.getByRole('button', { name: '1주' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(
      screen.getByRole('button', { name: DASHBOARD_MOCK.selectedRisingPeriod }),
    ).toHaveAttribute('aria-pressed', 'false')
  })

  it('기업 규모별 순위를 순번과 함께 표시한다', () => {
    render(<DashboardOverview />)

    // 순위 5 + 범례 4. 인기 기술 스택 막대는 ECharts로 대체 예정이라 DOM에 없다.
    expect(screen.getAllByRole('listitem')).toHaveLength(
      DASHBOARD_MOCK.companyRanks.length + DASHBOARD_MOCK.risingLegend.length,
    )
    expect(screen.getByText('01')).toBeInTheDocument()
    expect(screen.getByText('05')).toBeInTheDocument()
  })

  it('데이터가 없으면 두 차트에 안내 문구가 뜨고 순위 목록이 사라진다', () => {
    render(<DashboardOverview data={DASHBOARD_EMPTY_MOCK} />)

    expect(screen.getAllByText('정보가 없습니다.')).toHaveLength(2)
    expect(screen.queryByText('01')).not.toBeInTheDocument()
    // KPI는 0 또는 '-'
    expect(screen.getAllByText('0')).not.toHaveLength(0)
    expect(screen.getAllByText('-').length).toBeGreaterThanOrEqual(2)
  })

  it('데이터가 없어도 필터 칩과 기간 토글은 그대로 남는다', () => {
    render(<DashboardOverview data={DASHBOARD_EMPTY_MOCK} />)

    for (const filter of DASHBOARD_EMPTY_MOCK.stackFilters) {
      expect(screen.getByRole('button', { name: filter })).toBeInTheDocument()
    }
  })

  it('인기 기술 스택은 그래프 자리만 잡아 두고 헤더는 그대로 렌더한다', () => {
    render(<DashboardOverview />)

    const popular = screen
      .getByRole('heading', { name: '인기 기술 스택' })
      .closest('section') as HTMLElement

    // 그래프는 ECharts로 대체 예정 — 지금 이 카드에 그려진 데이터는 없다.
    expect(within(popular).queryAllByRole('listitem')).toHaveLength(0)
    expect(
      within(popular).getByText(
        '현재 가장 인기있는 기술 스택들을 그래프로 확인할 수 있습니다.',
      ),
    ).toBeInTheDocument()
  })
})
