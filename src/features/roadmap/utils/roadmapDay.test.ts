import { describe, expect, it } from 'vitest'
import type { RoadmapDay } from '../types'
import { currentDayNo, dayState, lockedMessage } from './roadmapDay'

const day = (dayNo: number, locked: boolean): RoadmapDay => ({
  dayNo,
  weekNo: 1,
  locked,
  allItemsDone: false,
  completed: false,
  retrospect: null,
  items: [],
})

describe('currentDayNo', () => {
  it('열린 날 중 마지막 날이 오늘이다', () => {
    expect(currentDayNo([day(1, false), day(2, false), day(3, true)])).toBe(2)
  })

  it('열린 날이 없으면 null', () => {
    expect(currentDayNo([day(1, true)])).toBeNull()
  })
})

describe('dayState', () => {
  it('잠긴 날 · 오늘 · 지난 날을 나눈다', () => {
    expect(dayState(day(3, true), 2)).toBe('locked')
    expect(dayState(day(2, false), 2)).toBe('current')
    expect(dayState(day(1, false), 2)).toBe('past')
  })
})

describe('lockedMessage', () => {
  it('바로 다음 날이면 "다음 날", 그 뒤로는 남은 일수를 보여준다', () => {
    expect(lockedMessage(3, 2)).toBe('다음 날에 열립니다.')
    expect(lockedMessage(4, 2)).toBe('2일 뒤에 열립니다.')
  })
})
