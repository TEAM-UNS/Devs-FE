import { describe, expect, it } from 'vitest'
import type { Roadmap } from '../types'
import { applyItemCheck } from './applyItemCheck'

const item = (itemId: number, done: boolean) => ({
  itemId,
  title: `항목 ${itemId}`,
  description: null,
  done,
})

const roadmap: Roadmap = {
  roadmapId: 1,
  status: 'completed',
  fieldName: '프론트엔드',
  summary: null,
  learningRate: 25,
  days: [
    {
      dayNo: 1,
      weekNo: 1,
      locked: false,
      allItemsDone: false,
      completed: false,
      retrospect: null,
      items: [item(1, true), item(2, false)],
    },
    {
      dayNo: 2,
      weekNo: 1,
      locked: false,
      allItemsDone: false,
      completed: false,
      retrospect: null,
      items: [item(3, false), item(4, false)],
    },
  ],
}

describe('applyItemCheck', () => {
  it('체크한 항목과 그날의 완료 여부, 학습률을 응답 값으로 바꾼다', () => {
    const next = applyItemCheck(roadmap, {
      itemId: 2,
      done: true,
      dayAllItemsDone: true,
      learningRate: 50,
    })

    expect(next.learningRate).toBe(50)
    expect(next.days[0].allItemsDone).toBe(true)
    expect(next.days[0].items[1].done).toBe(true)
  })

  it('다른 날과 원본은 건드리지 않는다', () => {
    const next = applyItemCheck(roadmap, {
      itemId: 2,
      done: true,
      dayAllItemsDone: true,
      learningRate: 50,
    })

    expect(next.days[1]).toBe(roadmap.days[1])
    expect(roadmap.days[0].items[1].done).toBe(false)
  })
})
