import { describe, expect, it } from 'vitest'
import { compareSearch, parseCompareIds } from './compareParams'

const parse = (query: string) => parseCompareIds(new URLSearchParams(query))

describe('parseCompareIds', () => {
  it('고른 순서대로 id를 읽는다', () => {
    expect(parse('ids=9,3,4')).toEqual([9, 3, 4])
  })

  it('숫자가 아닌 값·0·중복은 버린다', () => {
    expect(parse('ids=3,abc,0,3,-1,1.5,4')).toEqual([3, 4])
  })

  it('최대 5개까지만 읽는다', () => {
    expect(parse('ids=1,2,3,4,5,6')).toEqual([1, 2, 3, 4, 5])
  })

  it('값이 없으면 빈 배열', () => {
    expect(parse('')).toEqual([])
  })
})

describe('compareSearch', () => {
  it('쿼리 문자열로 만들고 다시 읽으면 같은 id가 나온다', () => {
    expect(parse(compareSearch([3, 4, 9]).slice(1))).toEqual([3, 4, 9])
  })
})
