import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ReportKpiCard } from './ReportKpiCard'

describe('ReportKpiCard', () => {
  it('상승은 증감률 앞에 +를 붙인다', () => {
    render(
      <ReportKpiCard
        label="이번주 최대 상승"
        name="Next.js"
        trend="up"
        percent={74}
      />,
    )

    expect(screen.getByText('이번주 최대 상승')).toBeInTheDocument()
    expect(screen.getByText('Next.js')).toBeInTheDocument()
    expect(screen.getByText(/\+74/)).toBeInTheDocument()
  })

  it('하락은 부호가 값에 이미 있어 +를 붙이지 않는다', () => {
    render(
      <ReportKpiCard
        label="이번주 최대 하락"
        name="React"
        trend="down"
        percent={-12}
      />,
    )

    const percent = screen.getByText(/-12/)
    expect(percent).toBeInTheDocument()
    expect(percent.textContent).not.toContain('+')
  })
})
