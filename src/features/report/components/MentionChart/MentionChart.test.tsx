import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { MentionBar } from '../../types'
import { MentionChart } from './MentionChart'

const BARS: MentionBar[] = [
  { name: 'JavaScript', last: 77, current: 90 },
  { name: 'React', last: 90, current: 33 },
]

describe('MentionChart', () => {
  it('기술마다 지난 주·이번 주 막대를 세운다', () => {
    render(<MentionChart bars={BARS} />)

    // 막대는 높이로만 값을 드러내므로 라벨로 읽을 수 있어야 한다.
    expect(
      screen.getByRole('img', { name: 'JavaScript 지난 주 77' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('img', { name: 'JavaScript 이번 주 90' }),
    ).toBeInTheDocument()
    expect(screen.getAllByRole('img')).toHaveLength(4)
  })

  it('값을 높이 비율로 그린다', () => {
    render(<MentionChart bars={BARS} />)

    expect(screen.getByRole('img', { name: 'React 지난 주 90' })).toHaveStyle({
      height: '90%',
    })
    expect(screen.getByRole('img', { name: 'React 이번 주 33' })).toHaveStyle({
      height: '33%',
    })
  })

  it('축 라벨을 기술 이름으로 붙인다', () => {
    render(<MentionChart bars={BARS} />)

    expect(screen.getByText('JavaScript')).toBeInTheDocument()
    expect(screen.getByText('React')).toBeInTheDocument()
  })
})
