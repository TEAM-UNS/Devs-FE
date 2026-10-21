import { queryOptions } from '@tanstack/react-query'
import { get, put } from '@/shared/api'

/**
 * GET·PUT /user/report-subscription 본문
 * 서버는 전체·분야별을 둘 다 켜는 것도 받지만 화면은 하나만 켜지게 둔다
 */
export interface ReportSubscription {
  totalReport: boolean
  majorReport: boolean
  /** 분야별 리포트를 받을 전공 id (`/majors`의 id) */
  majorIds: number[]
}

/** 내 리포트 구독 설정을 조회한다 */
export async function fetchReportSubscription(): Promise<ReportSubscription> {
  return get<ReportSubscription>('/user/report-subscription')
}

/** 구독 설정을 저장한다. 세 필드를 모두 받아 통째로 갈아끼운다 (204) */
export async function updateReportSubscription(
  subscription: ReportSubscription,
): Promise<void> {
  return put<void>('/user/report-subscription', subscription)
}

/** 리포트 구독 쿼리 정의. 로그아웃 때 사용자 캐시와 같이 비워지도록 user 아래에 둔다 */
export const subscriptionQueries = {
  detail: () =>
    queryOptions({
      queryKey: ['user', 'report-subscription'] as const,
      queryFn: fetchReportSubscription,
    }),
}
