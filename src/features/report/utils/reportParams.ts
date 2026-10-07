/** URL 쿼리 키. `?week=-1&major=3` */
export const REPORT_PARAMS = { week: 'week', major: 'major' } as const

/** 볼 수 있는 가장 최근 주차. 이번 주(0)는 아직 집계 중이라 지난주까지만 연다 */
export const LATEST_WEEK = -1

const INTEGER = /^-?\d+$/

/**
 * URL 쿼리에서 주차 offset과 전공 id를 읽는다
 * 없거나 잘못된 값은 지난주·전체(null)로 돌린다. 이번 주와 미래 주차는 집계가 없어 잘못된 값으로 본다
 */
export function parseReportParams(params: URLSearchParams): {
  week: number
  major: number | null
} {
  const week = params.get(REPORT_PARAMS.week) ?? ''
  const major = params.get(REPORT_PARAMS.major) ?? ''

  return {
    week:
      INTEGER.test(week) && Number(week) <= LATEST_WEEK
        ? Number(week)
        : LATEST_WEEK,
    major: /^\d+$/.test(major) && Number(major) > 0 ? Number(major) : null,
  }
}
