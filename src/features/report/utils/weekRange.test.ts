import { describe, expect, it } from 'vitest'
import { baseDateAt, weekOffsetOf } from './weekRange'

/* 기준 시각을 인자로 넣으므로 가짜 타이머가 필요 없다.
   기준이 보는 사람의 로컬 달력이라 날짜도 로컬 성분으로 만든다 — `'...Z'` 표기로 쓰면
   실행 환경 시간대에 따라 하루 밀려서 결과가 달라진다. */
describe('baseDateAt', () => {
  // 2026-09-09(수) 정오
  const wednesday = new Date(2026, 8, 9, 12)

  it('offset 0은 기준 시각의 날짜를 하이픈 형식으로 준다', () => {
    expect(baseDateAt(0, wednesday)).toBe('2026-09-09')
  })

  it('음수 offset은 7일씩 물러난다. 월요일로 맞추는 건 서버 몫이다', () => {
    expect(baseDateAt(-1, wednesday)).toBe('2026-09-02')
    expect(baseDateAt(-2, wednesday)).toBe('2026-08-26')
  })

  it('달·해를 넘어가도 날짜만 옮긴다', () => {
    expect(baseDateAt(-37, wednesday)).toBe('2025-12-24')
  })
})

describe('weekOffsetOf', () => {
  const wednesday = new Date(2026, 8, 9, 12)

  it('같은 주의 날짜는 0, 지난 주의 아무 날짜는 -1', () => {
    expect(weekOffsetOf('2026-09-07', wednesday)).toBe(0)
    expect(weekOffsetOf('2026-09-13', wednesday)).toBe(0)
    expect(weekOffsetOf('2026-09-06', wednesday)).toBe(-1)
    expect(weekOffsetOf('2026-08-31', wednesday)).toBe(-1)
  })

  it('달·해를 넘어가도 주 단위로 센다', () => {
    expect(weekOffsetOf('2025-12-31', wednesday)).toBe(-36)
  })
})
