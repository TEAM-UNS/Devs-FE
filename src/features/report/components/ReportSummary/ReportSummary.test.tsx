import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ReportSummary } from './ReportSummary'

const JULY_WEEK_2 = {
  year: 2026,
  label: '7월 2주차',
  start: '2026.07.06',
  end: '2026.07.12',
}

describe('ReportSummary', () => {
  it('문단이 없으면 주차를 넣은 빈 상태 문구를 보여준다', () => {
    render(<ReportSummary week={JULY_WEEK_2} paragraphs={[]} />)

    expect(
      screen.getByRole('region', { name: '요약 리포트' }),
    ).toHaveTextContent('2026년 7월 2주차 요약 리포트가 없습니다.')
    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
  })

  it('연도는 서버가 준 값을 쓴다', () => {
    // 12/28(월) ~ 1/3(일). 목요일(1/1)이 새해라 서버는 2027년 1월 1주차로 준다.
    render(
      <ReportSummary
        week={{
          year: 2027,
          label: '1월 1주차',
          start: '2026.12.28',
          end: '2027.01.03',
        }}
        paragraphs={[]}
      />,
    )

    expect(
      screen.getByText('2027년 1월 1주차 요약 리포트가 없습니다.'),
    ).toBeInTheDocument()
  })

  it('문단이 있으면 주차를 넣은 제목과 본문을 보여준다', () => {
    render(
      <ReportSummary
        week={JULY_WEEK_2}
        paragraphs={['첫 문단', '둘째 문단']}
      />,
    )

    expect(
      screen.getByRole('heading', {
        name: '[AI 리포트] 2026년 7월 2주차 요약',
      }),
    ).toBeInTheDocument()
    expect(screen.getByText(/첫 문단\s+둘째 문단/)).toBeInTheDocument()
    expect(screen.queryByText(/요약 리포트가 없습니다/)).not.toBeInTheDocument()
  })
})
