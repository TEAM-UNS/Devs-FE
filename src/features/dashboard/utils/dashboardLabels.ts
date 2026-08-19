import type { CompanySize, RisingPeriod } from '../types'

/**
 * 기업 규모의 화면 표기. 값은 API 명세의 ENUM, 라벨은 디자인 표기다.
 * 카드가 `‹ 스타트업 ›`으로 좌우 전환하므로 순서가 곧 전환 순서다.
 */
export const COMPANY_SIZES: { value: CompanySize; label: string }[] = [
  { value: 'STARTUP', label: '스타트업' },
  { value: 'SMALL', label: '중소기업' },
  { value: 'MEDIUM', label: '중견기업' },
  { value: 'LARGE', label: '대기업' },
]

/** 급상승 기간 토글. 라벨은 Figma 표기(`1주`·`한 달`), 값은 명세의 ENUM. */
export const RISING_PERIODS: { value: RisingPeriod; label: string }[] = [
  { value: 'WEEK', label: '1주' },
  { value: 'MONTH', label: '한 달' },
]

/** 전공 필터의 '전체' 칩. 서버에 `major_id`를 안 보내면 전체 집계가 온다. */
export const ALL_MAJORS_LABEL = '전체'

/**
 * `2026-07-01` → `7월 1일`. 급상승 그래프의 시점 라벨(툴팁 전용)로 쓴다.
 *
 * @param isoDate 서버가 준 날짜 문자열
 * @returns 화면 표기 (형식이 다르면 원문 그대로)
 */
export function formatAxisDate(isoDate: string): string {
  const [, month, day] = isoDate.split('-')
  if (!month || !day) return isoDate

  return `${Number(month)}월 ${Number(day)}일`
}
