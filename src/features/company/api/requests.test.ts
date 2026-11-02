import { beforeEach, describe, expect, it, vi } from 'vitest'
import { get } from '@/shared/api'
import { fetchCompanies, fetchCompare } from './requests'

vi.mock('@/shared/api', () => ({
  get: vi.fn(() => Promise.resolve({})),
}))

beforeEach(() => {
  vi.mocked(get).mockClear()
})

describe('기업 목록 요청', () => {
  it('검색어와 페이지를 20개 단위로 보낸다', async () => {
    await fetchCompanies('토스', 2)

    expect(get).toHaveBeenCalledWith('/company', {
      keyword: '토스',
      page: 2,
      size: 20,
    })
  })

  it('검색어가 비면 keyword를 보내지 않는다', async () => {
    await fetchCompanies('', 0)

    expect(get).toHaveBeenCalledWith('/company', {
      keyword: undefined,
      page: 0,
      size: 20,
    })
  })
})

describe('기업 비교 요청', () => {
  it.each([
    'top-skills',
    'common-skills',
    'skill-mentions',
    'match-rates',
    'posting-counts',
  ] as const)('%s — 고른 순서대로 id를 쉼표로 이어 보낸다', async (kind) => {
    await fetchCompare(kind, [9, 3, 4])

    expect(get).toHaveBeenCalledWith(`/company/compare/${kind}`, {
      company_ids: '9,3,4',
    })
  })
})
