import { get } from '@/shared/api'
import type {
  EarliestPostingDateResponse,
  PopularTechStackResponse,
  ReportPeriod,
  TechMentionsResponse,
  TechTrendResponse,
  WeeklyCollectedCountResponse,
} from '../types'

/** 인기 기술 스택 조회 */
export async function fetchPopularTechStack(
  majorId: number,
  period: ReportPeriod,
  baseDate: string,
): Promise<PopularTechStackResponse> {
  return get<PopularTechStackResponse>('/report/popular-tech-stack', {
    major_id: majorId,
    period,
    base_date: baseDate,
  })
}

/** 이번 주 최대 상승 기술 조회 데이터가 없으면 404 */
export async function fetchMaxIncrease(
  baseDate: string,
  majorId?: number,
): Promise<TechTrendResponse> {
  return get<TechTrendResponse>('/report/max-increase', {
    base_date: baseDate,
    major_id: majorId,
  })
}

/** 이번 주 최대 하락 기술 조회 데이터가 없으면 404 */
export async function fetchMaxDecrease(
  baseDate: string,
  majorId?: number,
): Promise<TechTrendResponse> {
  return get<TechTrendResponse>('/report/max-decrease', {
    base_date: baseDate,
    major_id: majorId,
  })
}

/** 주요 기술 언급량 조회 */
export async function fetchTechMentions(
  baseDate: string,
  majorId?: number,
): Promise<TechMentionsResponse> {
  return get<TechMentionsResponse>('/report/tech-mentions', {
    base_date: baseDate,
    major_id: majorId,
  })
}

/** 해당 주에 수집된 전체 공고 수 조회 */
export async function fetchWeeklyCollectedCount(
  baseDate: string,
): Promise<WeeklyCollectedCountResponse> {
  return get<WeeklyCollectedCountResponse>('/report/weekly-collected-count', {
    base_date: baseDate,
  })
}

/** 가장 오래된 공고 게시일 조회 */
export async function fetchEarliestPostingDate(): Promise<EarliestPostingDateResponse> {
  return get<EarliestPostingDateResponse>('/report/earliest-posting-date')
}
