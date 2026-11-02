import { beforeEach, describe, expect, it } from 'vitest'
import { loadFilters, saveFilters } from './filterMemory'

const KEY = 'uns-dashboard-filters'

describe('filterMemory', () => {
  beforeEach(() => localStorage.clear())

  it('저장한 선택을 그대로 돌려준다', () => {
    saveFilters({ majorId: 3, companySize: 'MEDIUM', period: 'WEEK' })

    expect(loadFilters()).toEqual({
      majorId: 3,
      companySize: 'MEDIUM',
      period: 'WEEK',
    })
  })

  it('저장분이 없거나 모양이 어긋나면 null', () => {
    expect(loadFilters()).toBeNull()

    localStorage.setItem(KEY, '{깨진 JSON')
    expect(loadFilters()).toBeNull()

    localStorage.setItem(
      KEY,
      JSON.stringify({ companySize: 'HUGE', period: 'WEEK' }),
    )
    expect(loadFilters()).toBeNull()
  })

  it('전공이 숫자가 아니면 전체(undefined)로 읽는다', () => {
    localStorage.setItem(
      KEY,
      JSON.stringify({ majorId: '1', companySize: 'SMALL', period: 'MONTH' }),
    )

    expect(loadFilters()).toEqual({
      majorId: undefined,
      companySize: 'SMALL',
      period: 'MONTH',
    })
  })
})
