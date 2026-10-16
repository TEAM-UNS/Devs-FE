import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query'
import { trackEvent } from '@/shared/analytics'
import { type CompareKind, fetchCompanies, fetchCompare } from './requests'

export const companyQueries = {
  all: () => ['company'] as const,

  list: (keyword: string) =>
    infiniteQueryOptions({
      queryKey: [...companyQueries.all(), 'list', keyword] as const,
      queryFn: ({ pageParam }) => {
        /* 디바운스 도입 전후로 검색 한 번에 요청이 몇 번 가는지 비교하려고 센다
           스크롤로 받는 다음 페이지와 검색어 없는 첫 목록은 검색이 아니라 빼고,
           검색어 자체는 개인정보·고유값 폭발 때문에 길이만 남긴다 */
        if (keyword && pageParam === 0) {
          trackEvent('Company Search Requested', {
            keyword_length: keyword.length,
          })
        }
        return fetchCompanies(keyword, pageParam)
      },
      initialPageParam: 0,
      getNextPageParam: (last) => (last.hasNext ? last.page + 1 : undefined),
    }),

  /* 고른 순서가 색을 정해서 같은 기업이라도 순서가 다르면 다른 키로 둔다 */
  compare: <K extends CompareKind>(kind: K, ids: readonly number[]) =>
    queryOptions({
      queryKey: [...companyQueries.all(), 'compare', kind, ids] as const,
      queryFn: () => fetchCompare(kind, ids),
    }),
}
