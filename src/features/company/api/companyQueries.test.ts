import type { QueryFunctionContext } from '@tanstack/react-query'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { trackEvent } from '@/shared/analytics'
import { companyQueries } from './companyQueries'

vi.mock('@/shared/analytics', () => ({ trackEvent: vi.fn() }))
vi.mock('./requests', () => ({
  fetchCompanies: vi.fn(() => Promise.resolve({})),
  fetchCompare: vi.fn(),
}))

/** 목록 쿼리의 queryFn을 원하는 페이지로 부른다 */
function requestPage(keyword: string, pageParam: number) {
  const { queryFn } = companyQueries.list(keyword)
  return queryFn?.({ pageParam } as QueryFunctionContext<
    readonly ['company', 'list', string],
    number
  >)
}

beforeEach(() => {
  vi.mocked(trackEvent).mockClear()
})

describe('기업 검색 요청 이벤트', () => {
  it('검색어로 첫 페이지를 요청하면 검색어 길이만 보낸다', async () => {
    await requestPage('카카', 0)

    expect(trackEvent).toHaveBeenCalledWith('Company Search Requested', {
      keyword_length: 2,
    })
  })

  it('스크롤로 받는 다음 페이지는 세지 않는다', async () => {
    await requestPage('카카', 1)

    expect(trackEvent).not.toHaveBeenCalled()
  })

  it('검색어 없는 첫 목록은 세지 않는다', async () => {
    await requestPage('', 0)

    expect(trackEvent).not.toHaveBeenCalled()
  })
})
