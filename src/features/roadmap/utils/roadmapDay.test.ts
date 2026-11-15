import { describe, expect, it } from 'vitest'
import type { RoadmapDay } from '../types'
import {
  currentDayNo,
  dayState,
  canFinishRoadmap,
  finishesRoadmap,
  lockedMessage,
} from './roadmapDay'

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

describe('finishesRoadmap', () => {
  const done = (dayNo: number) => ({ ...day(dayNo, false), completed: true })

  it('나머지 날을 모두 마쳤을 때만 로드맵이 끝난다', () => {
    expect(finishesRoadmap([done(1), day(2, false)], 2)).toBe(true)
    expect(finishesRoadmap([day(1, false), day(2, false)], 2)).toBe(false)
    expect(finishesRoadmap([done(1), day(2, false), day(3, true)], 2)).toBe(
      false,
    )
  })
})

describe('canFinishRoadmap', () => {
  it('마지막 날이 열렸으면 그날 할 일과 상관없이 완주할 수 있다', () => {
    expect(canFinishRoadmap([day(1, false), day(2, false)])).toBe(true)
    expect(canFinishRoadmap([day(1, false), day(2, true)])).toBe(false)
    expect(canFinishRoadmap([])).toBe(false)
  })
})
