import { describe, expect, it } from 'vitest'
import type { Retrospect } from '../types'
import { formatBoardDate, splitIntoRows } from './board'

const retrospect = (retrospectId: number): Retrospect => ({
  retrospectId,
  dayNo: 1,
  content: '',
  date: '2026-10-26',
  likeCount: 0,
  liked: false,
})

const ids = (rows: Retrospect[][]) =>
  rows.map((row) => row.map(({ retrospectId }) => retrospectId))

describe('splitIntoRows', () => {
  it('세 줄에 차례로 나눈다', () => {
    expect(ids(splitIntoRows([1, 2, 3, 4, 5].map(retrospect)))).toEqual([
      [1, 4],
      [2, 5],
      [3],
    ])
  })

  it('회고가 적으면 빈 줄을 만들지 않는다', () => {
    expect(ids(splitIntoRows([1].map(retrospect)))).toEqual([[1]])
    expect(splitIntoRows([])).toEqual([])
  })
})

describe('formatBoardDate', () => {
  it('Figma처럼 점으로 잇는다', () => {
    expect(formatBoardDate('2026-08-23')).toBe('2026.08.23')
  })
})
