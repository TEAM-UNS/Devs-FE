/*
 * 대시보드 API의 응답 모양. Notion 명세(`/dashboard` 카테고리 4건)를 그대로 옮긴 것이며,
 * 화면이 쓰는 타입(`dashboard.ts`)과는 별개다. 응답 필드는 카멜케이스,
 * 쿼리 파라미터는 스네이크케이스다(`major_id`·`company_size`).
 */

/** 기업 규모. `company-size-tech-stacks`의 쿼리 값이자 응답 값. */
export type CompanySize = 'STARTUP' | 'SMALL' | 'MEDIUM' | 'LARGE'

/** 급상승 조회 기간. */
export type RisingPeriod = 'WEEK' | 'MONTH'

/** 이름과 수치 한 쌍. 집계 대상이 없으면 `name`이 null로 온다. */
export interface NamedCount {
  name: string | null
  count: number
}

/** 이름과 상승률 한 쌍. 집계 대상이 없으면 `name`이 null로 온다. */
export interface NamedRate {
  name: string | null
  rate: number
}

/** GET /dashboard/summary 응답 (200). KPI 카드 4장의 원본. */
export interface DashboardSummaryResponse {
  todayCollectedCount: number
  todayDiff: number
  activeCompanyCount: number
  companyDiff: number
  mostMentionedTech: NamedCount
  mostRisingTech: NamedRate
}

/** 인기 기술 스택 한 줄. */
export interface PopularTechStackDto {
  rank: number
  techStackId: number
  name: string
  count: number
}

/**
 * GET /dashboard/popular-tech-stacks 응답 (200).
 * `major_id`를 빼면 전체 공고를 집계한다.
 */
export interface PopularTechStacksResponse {
  major: string
  techStacks: PopularTechStackDto[]
}

/** 기업 규모별 기술 스택 한 줄. 비율(%)로 온다. */
export interface CompanySizeTechStackDto {
  rank: number
  name: string
  percentage: number
}

/** GET /dashboard/company-size-tech-stacks 응답 (200). */
export interface CompanySizeTechStacksResponse {
  companySize: CompanySize
  category: string
  techStacks: CompanySizeTechStackDto[]
}

/** 급상승 그래프의 한 시점. */
export interface RisingPointDto {
  date: string
  value: number
}

/** 급상승 그래프의 시리즈 하나. */
export interface RisingTechStackDto {
  techStackId: number
  name: string
  values: RisingPointDto[]
}

/** GET /dashboard/best-tech-stacks 응답 (200). */
export interface BestTechStacksResponse {
  period: RisingPeriod
  majorId: number
  techStacks: RisingTechStackDto[]
}
