import { describe, expect, it } from 'vitest'
import { parseReportParams } from './reportParams'

const parse = (query: string) => parseReportParams(new URLSearchParams(query))

describe('parseReportParams', () => {
  it('주차와 전공을 숫자로 읽는다', () => {
    expect(parse('week=-3&major=2')).toEqual({ week: -3, major: 2 })
  })

  it('값이 없으면 지난주·전체', () => {
    expect(parse('')).toEqual({ week: -1, major: null })
  })

  it.each(['abc', '1.5', '-1e2', '', '3', '0', '-0'])(
    '잘못된 주차(%s)는 지난주로 돌린다 — 이번 주·미래 주차도 포함',
    (week) => {
      expect(parse(`week=${week}`).week).toBe(-1)
    },
  )

  it.each(['abc', '0', '-2', '1.5'])(
    '잘못된 전공(%s)은 전체로 돌린다',
    (major) => {
      expect(parse(`major=${major}`).major).toBeNull()
    },
  )
})
