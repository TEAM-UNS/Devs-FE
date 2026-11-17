import { describe, expect, it } from 'vitest'
import type { RoadmapSummary } from '../types'
import { latestRoadmap } from './roadmapList'

const summary = (roadmapId: number): RoadmapSummary => ({
  roadmapId,
  majorId: 1,
  majorName: '프론트엔드',
  targetWeeks: 4,
  status: 'completed',
  date: '2026-11-01',
})

describe('latestRoadmap', () => {
  it('목록 순서와 상관없이 id가 가장 큰 로드맵을 고른다', () => {
    expect(latestRoadmap([summary(3), summary(7), summary(5)])?.roadmapId).toBe(
      7,
    )
  })

  it('로드맵이 없으면 undefined', () => {
    expect(latestRoadmap([])).toBeUndefined()
  })
})
