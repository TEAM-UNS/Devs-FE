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
 * 넘겨 받은 날짜를 `2026-09-07`로 만드는 함수
 * `toISOString()`을 쓰면 안 됨 UTC로 바꿔서 글자를 만들기 때문에 한국 9월 7일 0시가
 * UTC 9월 6일 15시가 되어 하루 앞당겨진다
 */
function formatDate(date: Date): string {
  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
  ].join('-')
}

/**
 * 요청에 보낼 기준일. 이번 주로부터 offset주 떨어진 날을 `2026-09-09`로 만든다
 * 그 주의 월요일로 맞추는 건 서버(week-range·리포트 API)가 하므로 날짜만 옮긴다
 *
 * @param offset 0이면 기준 시각이 속한 주, 음수면 과거
 * @param now 기준 시각. 테스트에서 특정 날짜를 넣으려고 열어 둔다
 */
export function baseDateAt(offset: number, now: Date = new Date()): string {
  return formatDate(addDays(now, offset * 7))
}

/**
 * `2026-09-07` 같은 날짜가 기준 시각의 주로부터 몇 주 떨어져 있는지 반환 (과거면 음수)
 * `new Date('2026-09-07')`은 UTC 자정으로 읽혀 한국에서는 맞지만 서쪽 시간대에서 하루 밀리므로
 * 로컬 성분으로 만든다
 */
export function weekOffsetOf(date: string, now: Date = new Date()): number {
  const [year, month, day] = date.split('-').map(Number)
  const target = startOfWeek(new Date(year, month - 1, day))

  // 서머타임이 있는 시간대에서는 한 주가 정확히 7일 ms가 아니라 반올림한다
  return Math.round((target.getTime() - startOfWeek(now).getTime()) / WEEK_MS)
}
