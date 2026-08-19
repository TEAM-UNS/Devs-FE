import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import {
  MOCK_COMPANY_SIZE,
  MOCK_POPULAR,
  MOCK_RISING,
  MOCK_SUMMARY,
  MOCK_SUMMARY_EMPTY,
} from '@/test/fixtures/dashboard'
import { MOCK_MAJORS } from '@/test/fixtures/majors'
import { renderWithQuery } from '@/test/renderWithQuery'
import { DashboardOverview } from './DashboardOverview'

/**
 * jsdom에는 캔버스 2D 컨텍스트가 없어 ECharts를 띄울 수 없다. 여기서 검증할 것은
 * "무엇을 어떻게 조립했는가"이고, 차트가 그려낸 픽셀은 ECharts의 책임이다.
 */
vi.mock('../../hooks/useEChart', () => ({
  useEChart: () => ({ current: null }),
}))

/* 요약만 상황별로 바꿔 끼우고, 나머지는 고정 응답을 쓴다. */
let summaryResponse = MOCK_SUMMARY

// 전송 계층만 막아 요청 함수·쿼리 팩토리는 실제로 돌게 둔다.
vi.mock('@/shared/api/http', () => ({
  get: vi.fn((path: string) => {
    if (path === '/majors') return Promise.resolve(MOCK_MAJORS)
    if (path === '/dashboard/summary') return Promise.resolve(summaryResponse)
    if (path === '/dashboard/popular-tech-stacks')
      return Promise.resolve(MOCK_POPULAR)
    if (path === '/dashboard/company-size-tech-stacks')
      return Promise.resolve(MOCK_COMPANY_SIZE)
    return Promise.resolve(MOCK_RISING)
  }),
  post: vi.fn(),
}))

const CARD_TITLES = [
  '인기 기술 스택',
  '기업 규모별 기술 스택 분석',
  '급상승 기술 스택',
]

describe('DashboardOverview', () => {
  it('KPI 카드 4장과 차트 카드 3종을 렌더링한다', async () => {
    renderWithQuery(<DashboardOverview />)

    expect(await screen.findAllByRole('article')).toHaveLength(4)
    for (const title of CARD_TITLES) {
      expect(screen.getByRole('heading', { name: title })).toBeInTheDocument()
    }
  })

  it('요약 응답을 KPI 값과 증감 문구로 옮긴다', async () => {
    renderWithQuery(<DashboardOverview />)

    expect(await screen.findByText('189')).toBeInTheDocument()

    const mentionCard = screen
      .getByRole('heading', { name: '이번주 최다 언급' })
      .closest('article') as HTMLElement
    expect(within(mentionCard).getByText('React')).toBeInTheDocument()

    // 문구는 노드가 쪼개져 있으므로 느슨하게 매칭한다
    expect(screen.getByText(/전일 대비/)).toHaveTextContent(/-62건/)
    expect(within(mentionCard).getByText(/건에 등장/)).toHaveTextContent(
      /공고 123건에 등장/,
    )
  })

  it('필터 칩은 서버가 준 전공 이름으로 그려지고 단일 선택이다', async () => {
    renderWithQuery(<DashboardOverview />)

    // 칩은 전공 목록이 도착한 뒤에 늘어난다
    const backend = await screen.findByRole('button', { name: 'BACKEND' })
    // 처음에는 '전체'가 선택돼 있다 (major_id를 보내지 않는 상태)
    expect(screen.getByRole('button', { name: '전체' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )

    await userEvent.click(backend)

    expect(screen.getByRole('button', { name: 'BACKEND' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(screen.getByRole('button', { name: '전체' })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
  })

  it('기간 토글도 단일 선택으로 바뀐다', async () => {
    renderWithQuery(<DashboardOverview />)

    await userEvent.click(await screen.findByRole('button', { name: '1주' }))

    expect(screen.getByRole('button', { name: '1주' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(screen.getByRole('button', { name: '한 달' })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
  })

  it('기업 규모는 화살표로 앞뒤로 전환되고 양 끝에서 순환한다', async () => {
    renderWithQuery(<DashboardOverview />)

    expect(await screen.findByText('스타트업')).toBeInTheDocument()

    await userEvent.click(
      screen.getByRole('button', { name: '다음 기업 규모' }),
    )
    expect(screen.getByText('중소기업')).toBeInTheDocument()

    // 첫 항목에서 이전으로 가면 마지막으로 돌아간다
    await userEvent.click(
      screen.getByRole('button', { name: '이전 기업 규모' }),
    )
    await userEvent.click(
      screen.getByRole('button', { name: '이전 기업 규모' }),
    )
    expect(screen.getByText('대기업')).toBeInTheDocument()
  })

  it('기업 규모별 순위를 순번과 함께 표시한다', async () => {
    renderWithQuery(<DashboardOverview />)

    // 순위 3 + 급상승 범례 2
    expect(await screen.findByText('01')).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(
      MOCK_COMPANY_SIZE.tech_stacks.length + MOCK_RISING.tech_stacks.length,
    )
  })

  it('집계 대상이 없으면 KPI 값이 - 로 나온다', async () => {
    summaryResponse = MOCK_SUMMARY_EMPTY
    renderWithQuery(<DashboardOverview />)

    const mentionCard = (
      await screen.findByRole('heading', { name: '이번주 최다 언급' })
    ).closest('article') as HTMLElement
    expect(within(mentionCard).getByText('-')).toBeInTheDocument()

    summaryResponse = MOCK_SUMMARY
  })
})
