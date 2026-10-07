import axios from 'axios'
import { get } from '@/shared/api'
import type {
  PopularTechStackResponse,
  ReportPeriod,
  TechMentionsResponse,
  TechTrendResponse,
  WeeklyCollectedCountResponse,
} from '../types'

/** 인기 기술 스택 조회 */
export async function fetchPopularTechStack(
  majorId: number | undefined,
  period: ReportPeriod,
  baseDate: string,
): Promise<PopularTechStackResponse> {
  return get<PopularTechStackResponse>('/report/popular-tech-stack', {
    major_id: majorId,
    period,
    base_date: baseDate,
  })
}

/* 최대 상승·하락은 해당하는 기술이 없으면 404로 온다. 실패가 아니라 집계가 없는 것이라
   여기서 null로 바꾼다 — 에러로 올리면 전역 QueryCache가 에러 토스트를 띄운다 */
async function nullIfNotFound<T>(request: Promise<T>): Promise<T | null> {
  try {
    return await request
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) return null
    throw error
  }
}

/** 이번 주 최대 상승 기술 조회 해당 기술이 없으면 null */
export async function fetchMaxIncrease(
  baseDate: string,
  majorId?: number,
): Promise<TechTrendResponse | null> {
  return nullIfNotFound(
    get<TechTrendResponse>('/report/max-increase', {
      base_date: baseDate,
      major_id: majorId,
    }),
  )
}

/** 이번 주 최대 하락 기술 조회 해당 기술이 없으면 null */
export async function fetchMaxDecrease(
  baseDate: string,
  majorId?: number,
): Promise<TechTrendResponse | null> {
  return nullIfNotFound(
    get<TechTrendResponse>('/report/max-decrease', {
      base_date: baseDate,
      major_id: majorId,
    }),
  )
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
