import type { WeekRange } from '../types'

/*
 * 주차 라벨·날짜 범위 계산.
 *
 * ⚠️ 임시다. 서버가 주간 리포트를 내려주면 라벨·범위도 응답에 실려 올 가능성이 높고,
 * 그러면 이 파일은 사라진다. 지금은 화살표를 눌렀을 때 주차가 실제로 바뀌는지
 * 확인하려고 둔다.
 *
 * 전제 두 가지 (서버 정의를 못 받아 디자인에서 역산했다):
 * ① 한 주는 월요일에 시작한다 — 디자인의 `2026.07.06 ~ 2026.07.12`가 월~일이다.
 * ② 그 달 1일이 속한 주가 1주차다 — 2026-07-01(수)이 속한 주가 1주차라야
 *    7/6 시작 주가 `7월 2주차`가 되어 디자인과 맞는다.
 */

const DAY_MS = 24 * 60 * 60 * 1000
const WEEK_MS = 7 * DAY_MS

/** 디자인에 그려진 주(월요일 시작). 여기서 오프셋만큼 앞뒤로 움직인다. */
const BASE_MONDAY = Date.UTC(2026, 6, 6)

/** 월요일=0 … 일요일=6. `getUTCDay()`는 일요일이 0이라 그대로 쓰면 어긋난다. */
function mondayIndex(date: Date): number {
  return (date.getUTCDay() + 6) % 7
}

/** `2026.07.06` 형태로 찍는다. */
function formatDate(date: Date): string {
  const y = date.getUTCFullYear()
  const m = String(date.getUTCMonth() + 1).padStart(2, '0')
  const d = String(date.getUTCDate()).padStart(2, '0')

  return `${y}.${m}.${d}`
}

/**
 * 그 달에서 몇 번째 주인지. 1일이 속한 주를 1주차로 센다.
 *
 * @param monday 주의 시작(월요일)
 * @returns 1부터 시작하는 주차 번호
 */
function weekOfMonth(monday: Date): number {
  const first = new Date(
    Date.UTC(monday.getUTCFullYear(), monday.getUTCMonth(), 1),
  )
  // 1일이 속한 주의 월요일. 1일이 수요일이면 이틀 전으로 물러난다.
  const firstMonday = first.getTime() - mondayIndex(first) * DAY_MS

  return Math.round((monday.getTime() - firstMonday) / WEEK_MS) + 1
}

/**
 * 기준 주에서 `offset`주만큼 이동한 주차.
 *
 * @param offset 0이면 기준 주, 음수면 과거
 * @returns 헤더에 표시할 주차 라벨과 날짜 범위
 */
export function weekRangeAt(offset: number): WeekRange {
  const monday = new Date(BASE_MONDAY + offset * WEEK_MS)
  const sunday = new Date(monday.getTime() + 6 * DAY_MS)

  return {
    label: `${monday.getUTCMonth() + 1}월 ${weekOfMonth(monday)}주차`,
    start: formatDate(monday),
    end: formatDate(sunday),
  }
}
