import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { CompetencyRank, CompetencyTag } from '../../types'
import { CompetencyPanel } from './CompetencyPanel'

const TAGS: CompetencyTag[] = [
  { id: 't1', label: '대용량 트래픽 처리', highlighted: false },
  { id: 't2', label: 'CI/CD 구축 경험', highlighted: true },
]

const RANKS: CompetencyRank[] = [
  { id: 'c1', label: '대용량 트래픽 처리', percent: 82 },
  { id: 'c2', label: 'CI/CD 구축 경험', percent: 48 },
]

describe('CompetencyPanel', () => {
  it('태그는 누르는 요소가 아니다', () => {
    render(<CompetencyPanel tags={TAGS} ranks={RANKS} />)

    // 강조는 색으로만 드러난다. selected를 주면 버튼이 되어 상호작용이 없는데도
    // 스크린리더가 토글로 읽는다.
    const tagList = screen.getByRole('list', { name: '자주 나오는 역량 태그' })
    expect(within(tagList).queryByRole('button')).toBeNull()
  })

  it('순위 게이지를 비중만큼 채우고 값을 노출한다', () => {
    render(<CompetencyPanel tags={TAGS} ranks={RANKS} />)

    const gauges = screen.getAllByRole('progressbar')
    expect(gauges).toHaveLength(2)
    expect(gauges[0]).toHaveAttribute('aria-valuenow', '82')
    expect(gauges[0].firstElementChild).toHaveStyle({ width: '82%' })
    expect(screen.getByText('82%')).toBeInTheDocument()
  })

  it('순위 번호는 목록 순서를 따른다', () => {
    render(<CompetencyPanel tags={TAGS} ranks={RANKS} />)

    const ranks = screen.getByRole('list', { name: '역량 비중 순위' })
    const rows = within(ranks).getAllByRole('listitem')

    expect(rows).toHaveLength(2)
    expect(within(rows[0]).getByText('01')).toBeInTheDocument()
    expect(within(rows[1]).getByText('02')).toBeInTheDocument()
  })
})
