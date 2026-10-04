import { get } from '@/shared/api'
import type {
  BestTechStacksResponse,
  CompanySize,
  CompanySizeTechStacksResponse,
  DashboardSummaryResponse,
  PopularTechStacksResponse,
  RisingPeriod,
} from '../types'

/* 대시보드 조회는 전부 /dashboard 아래에 있다. */

/** KPI 카드 4장의 원본을 조회한다. (GET /dashboard/summary) */
export async function fetchSummary(): Promise<DashboardSummaryResponse> {
  return get<DashboardSummaryResponse>('/dashboard/summary')
}

/**
 * 인기 기술 스택을 조회한다. (GET /dashboard/popular-tech-stacks)
 *
 * @param majorId 전공 필터. 없으면 전체 공고를 집계한다
 */
export async function fetchPopularTechStacks(
  majorId?: number,
): Promise<PopularTechStacksResponse> {
  return get<PopularTechStacksResponse>('/dashboard/popular-tech-stacks', {
    major_id: majorId,
  })
}

/** 기업 규모별 기술 스택을 조회한다. (GET /dashboard/company-size-tech-stacks) */
export async function fetchCompanySizeTechStacks(
  companySize: CompanySize,
  majorId?: number,
): Promise<CompanySizeTechStacksResponse> {
  return get<CompanySizeTechStacksResponse>(
    '/dashboard/company-size-tech-stacks',
    { company_size: companySize, major_id: majorId },
  )
}

/** 급상승 기술 스택을 조회한다. (GET /dashboard/best-tech-stacks) */
export async function fetchBestTechStacks(
  period: RisingPeriod,
  majorId?: number,
): Promise<BestTechStacksResponse> {
  return get<BestTechStacksResponse>('/dashboard/best-tech-stacks', {
    period,
    major_id: majorId,
  })
}
