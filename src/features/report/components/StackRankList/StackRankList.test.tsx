import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { StackRank } from '../../types'
import { StackRankList } from './StackRankList'

const RANKS: StackRank[] = [
  { id: 'a', name: 'React', count: 3123, trend: 'up', delta: 32 },
  { id: 'b', name: 'Vue.js', count: 2983, trend: 'down', delta: 12 },
  { id: 'c', name: 'Svelte', count: 1123, trend: 'flat', delta: 22 },
]

describe('StackRankList', () => {
  it('순번을 목록 순서대로 두 자리로 매긴다', () => {
    render(<StackRankList ranks={RANKS} />)

    // 순번이 데이터가 아니라 순서에서 나오므로 둘이 어긋날 수 없다.
    const items = screen.getAllByRole('listitem')
    expect(items).toHaveLength(3)
    expect(within(items[0]).getByText('01')).toBeInTheDocument()
    expect(within(items[2]).getByText('03')).toBeInTheDocument()
  })

  it('건수에 천 단위 구분자를 넣는다', () => {
    render(<StackRankList ranks={RANKS} />)

    expect(screen.getByText('3,123건')).toBeInTheDocument()
    expect(screen.getByText('1,123건')).toBeInTheDocument()
  })

  it('증감 방향에 따라 숫자 색이 달라진다', () => {
    render(<StackRankList ranks={RANKS} />)

    const items = screen.getAllByRole('listitem')
    // 상승=빨강(error) · 하락=파랑(info) · 보합=회색. 삼각형과 같은 색을 쓴다.
    expect(within(items[0]).getByText('32').closest('span')).toHaveClass(
      'text-error',
    )
    expect(within(items[1]).getByText('12').closest('span')).toHaveClass(
      'text-info',
    )
    expect(within(items[2]).getByText('22').closest('span')).toHaveClass(
      'text-gray-400',
    )
  })
})
