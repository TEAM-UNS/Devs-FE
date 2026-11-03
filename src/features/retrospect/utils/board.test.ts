import { describe, expect, it } from 'vitest'
import type { Retrospect } from '../types'
import { formatBoardDate, groupByMonth, splitIntoRows } from './board'

const retrospect = (retrospectId: number, date = '2026-10-26'): Retrospect => ({
  retrospectId,
  dayNo: 1,
  content: '',
  date,
  likeCount: 0,
  liked: false,
})

const ids = (rows: Retrospect[][]) =>
  rows.map((row) => row.map(({ retrospectId }) => retrospectId))

describe('splitIntoRows', () => {
  it('세 줄에 차례로 나눈다', () => {
    expect(
      ids(splitIntoRows([1, 2, 3, 4, 5].map((id) => retrospect(id)))),
    ).toEqual([[1, 4], [2, 5], [3]])
  })

  it('회고가 적으면 빈 줄을 만들지 않는다', () => {
    expect(ids(splitIntoRows([1].map((id) => retrospect(id))))).toEqual([[1]])
    expect(splitIntoRows([])).toEqual([])
  })
})

describe('formatBoardDate', () => {
  it('Figma처럼 점으로 잇는다', () => {
    expect(formatBoardDate('2026-08-23')).toBe('2026.08.23')
  })
})

describe('groupByMonth', () => {
  it('최신순을 지키며 같은 달끼리 묶고 한글 머리글을 단다', () => {
    const groups = groupByMonth([
      retrospect(3, '2026-11-02'),
      retrospect(2, '2026-11-01'),
      retrospect(1, '2026-09-30'),
    ])

    expect(groups.map(({ label }) => label)).toEqual([
      '2026년 11월',
      '2026년 9월',
    ])
    expect(groups.map(({ retrospects }) => ids([retrospects])[0])).toEqual([
      [3, 2],
      [1],
    ])
  })

  it('회고가 없으면 빈 배열', () => {
    expect(groupByMonth([])).toEqual([])
  })
})
