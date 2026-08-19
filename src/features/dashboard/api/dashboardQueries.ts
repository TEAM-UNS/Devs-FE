import { queryOptions } from '@tanstack/react-query'
import type { CompanySize, RisingPeriod } from '../types'
import {
  fetchBestTechStacks,
  fetchCompanySizeTechStacks,
  fetchPopularTechStacks,
  fetchSummary,
} from './requests'

/**
 * 대시보드 조회 정의.
 *
 * 필터(전공·기간·규모)를 쿼리 키에 넣어, 선택이 바뀌면 react-query가 알아서
 * 다시 불러오고 이전 선택의 결과는 캐시에 남는다 — 되돌아갈 때 재요청이 없다.
 */
export const dashboardQueries = {
  all: () => ['dashboard'] as const,

  summary: () =>
    queryOptions({
      queryKey: [...dashboardQueries.all(), 'summary'] as const,
      queryFn: fetchSummary,
    }),

  popular: (majorId?: number) =>
    queryOptions({
      queryKey: [
        ...dashboardQueries.all(),
        'popular',
        majorId ?? null,
      ] as const,
      queryFn: () => fetchPopularTechStacks(majorId),
    }),

  companySize: (companySize: CompanySize, majorId?: number) =>
    queryOptions({
      queryKey: [
        ...dashboardQueries.all(),
        'company-size',
        companySize,
        majorId ?? null,
      ] as const,
      queryFn: () => fetchCompanySizeTechStacks(companySize, majorId),
    }),

  rising: (period: RisingPeriod, majorId?: number) =>
    queryOptions({
      queryKey: [
        ...dashboardQueries.all(),
        'rising',
        period,
        majorId ?? null,
      ] as const,
      queryFn: () => fetchBestTechStacks(period, majorId),
    }),
}
