import type { WeekRange } from '../types'

const WEEK_MS = 7 * 24 * 60 * 60 * 1000

const pad = (n: number) => String(n).padStart(2, '0')

/** 해당 일자가 포함된 주의 월요일을 찾는 함수 */
function startOfWeek(date: Date): Date {
  const monday = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7))

  return monday
}

/** 날짜에 일수를 더하는데 `setDate`가 월말·연말 넘김을 알아서 처리함 */
function addDays(date: Date, days: number): Date {
  const next = new Date(date)
  next.setDate(next.getDate() + days)

  return next
}

/**
 * 넘겨 받은 날짜를 `2026-09-07`(요청용) 또는 `2026.09.07`(화면용)로 만드는 함수
 * `toISOString()`을 쓰면 안 됨 UTC로 바꿔서 글자를 만들기 때문에 한국 9월 7일 0시가
 * UTC 9월 6일 15시가 되어 하루 앞당겨진다
 */
function formatDate(date: Date, separator: '-' | '.'): string {
  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
  ].join(separator)
}

/**
 * 그 달에서 몇 번째 주인지 계산하는 함수
 *
 * @param monday 주의 시작(월요일)
 * @returns 1부터 시작하는 주차 번호
 */
function weekOfMonth(monday: Date): number {
  const firstMonday = startOfWeek(
    new Date(monday.getFullYear(), monday.getMonth(), 1),
  )

  return Math.round((monday.getTime() - firstMonday.getTime()) / WEEK_MS) + 1
}

/**
 * 헤더에 표시할 주차 라벨, 날짜 범위와 요청에 보낼 기준일 반환
 *
 * @param offset 0이면 기준 시각이 속한 주, 음수면 과거
 * @param now 기준 시각. 테스트에서 특정 날짜를 넣으려고 열어 둔다
 * @returns 헤더에 표시할 주차 라벨, 날짜 범위와 요청에 보낼 기준일
 */
export function weekRangeAt(offset: number, now: Date = new Date()): WeekRange {
  const monday = addDays(startOfWeek(now), offset * 7)
  const sunday = addDays(monday, 6)

  return {
    label: `${monday.getMonth() + 1}월 ${weekOfMonth(monday)}주차`,
    start: formatDate(monday, '.'),
    end: formatDate(sunday, '.'),
    baseDate: formatDate(monday, '-'),
  }
}
