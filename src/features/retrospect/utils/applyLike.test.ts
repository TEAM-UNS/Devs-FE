import { describe, expect, it } from 'vitest'
import type { Retrospect } from '../types'
import { applyLike } from './applyLike'

const retrospect = (retrospectId: number): Retrospect => ({
  retrospectId,
  dayNo: 1,
  content: '',
  date: '2026-11-02',
  likeCount: 0,
  liked: false,
})

describe('applyLike', () => {
  it('그 회고의 개수와 좋아요 여부만 응답 값으로 바꾼다', () => {
    const list = [retrospect(1), retrospect(2)]
    const next = applyLike(list, { retrospectId: 2, likeCount: 5, liked: true })

    expect(next[1]).toMatchObject({ likeCount: 5, liked: true })
    expect(next[0]).toBe(list[0])
    expect(list[1].liked).toBe(false)
  })
})
