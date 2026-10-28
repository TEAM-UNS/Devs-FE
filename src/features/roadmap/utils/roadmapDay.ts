import type { RoadmapDay } from '../types'

/** past = 지난 날, current = 오늘(열린 날 중 마지막), locked = 아직 안 열린 날 */
export type DayState = 'past' | 'current' | 'locked'

/** 열린 날 중 마지막을 오늘로 본다. 열린 날이 없으면 null */
export function currentDayNo(days: readonly RoadmapDay[]): number | null {
  const opened = days.filter((day) => !day.locked)
  return opened.length > 0 ? opened[opened.length - 1].dayNo : null
}

/** 그날을 지난 날 · 오늘 · 잠긴 날 중 하나로 나눈다 */
export function dayState(day: RoadmapDay, today: number | null): DayState {
  if (day.locked) return 'locked'
  return day.dayNo === today ? 'current' : 'past'
}

/** 잠긴 날 안내 문구. 오늘을 모르면 날짜 없이 안내한다 */
export function lockedMessage(dayNo: number, today: number | null): string {
  if (today === null) return '아직 열리지 않았습니다.'
  const daysLeft = dayNo - today
  return daysLeft <= 1 ? '다음 날에 열립니다.' : `${daysLeft}일 뒤에 열립니다.`
}
