import { describe, expect, it } from 'vitest'
import { weekRangeAt } from './weekRange'

/* 기준 시각을 인자로 넣으므로 가짜 타이머가 필요 없다.
   기준이 보는 사람의 로컬 달력이라 날짜도 로컬 성분으로 만든다 — `'...Z'` 표기로 쓰면
   실행 환경 시간대에 따라 하루 밀려서 결과가 달라진다. */
describe('weekRangeAt', () => {
  // 2026-09-09(수) 정오. 그 주는 09-07(월)에 시작한다.
  const wednesday = new Date(2026, 8, 9, 12)

  it('offset 0은 기준 시각이 속한 주를 가리킨다', () => {
    expect(weekRangeAt(0, wednesday)).toEqual({
      label: '9월 2주차',
      start: '2026.09.07',
      end: '2026.09.13',
      baseDate: '2026-09-07',
    })
  })

  it('음수 offset은 과거로 한 주씩 물러난다', () => {
    expect(weekRangeAt(-1, wednesday).start).toBe('2026.08.31')
    expect(weekRangeAt(-2, wednesday).start).toBe('2026.08.24')
  })

  it('주가 달을 넘어가도 시작일이 속한 달로 센다', () => {
    // 08-31(월) ~ 09-06(일). 대부분 9월이지만 시작이 8월이라 8월로 센다.
    expect(weekRangeAt(-1, wednesday)).toMatchObject({
      label: '8월 6주차',
      start: '2026.08.31',
      end: '2026.09.06',
    })
  })

  it('baseDate는 시작일과 같은 날을 하이픈 형식으로 준다', () => {
    const week = weekRangeAt(-3, wednesday)

    expect(week.baseDate).toBe(week.start.replaceAll('.', '-'))
    expect(week.baseDate).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it('주의 첫날과 마지막 날도 그 주로 친다', () => {
    const monday = new Date(2026, 8, 7, 0, 30)
    const sunday = new Date(2026, 8, 13, 23, 30)

    expect(weekRangeAt(0, monday).start).toBe('2026.09.07')
    expect(weekRangeAt(0, sunday).start).toBe('2026.09.07')
  })
})
