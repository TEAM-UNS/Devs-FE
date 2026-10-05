import { describe, expect, it } from 'vitest'
import type { PopularTechStackItemDto } from '../types'
import {
  toCollectedCount,
  toMentionBars,
  toStackRanks,
  toTrendHighlights,
} from './reportMappers'

const item = (
  overrides: Partial<PopularTechStackItemDto>,
): PopularTechStackItemDto => ({
  rank: 1,
  techStackId: 1,
  name: 'React',
  searchCount: 100,
  previousSearchCount: 90,
  changeCount: 10,
  changeRate: 11.1,
  trend: 'UP',
  ...overrides,
})

describe('toStackRanks', () => {
  it('rank 순서로 정렬하고 증감은 방향과 절댓값으로 나눈다', () => {
    const ranks = toStackRanks({
      majorId: 1,
      period: 'WEEK',
      baseDate: '2026-09-07',
      items: [
        item({
          rank: 2,
          techStackId: 7,
          name: 'Vue',
          trend: 'DOWN',
          changeCount: -12,
        }),
        item({ rank: 1, techStackId: 3, name: 'React', searchCount: 3123 }),
        item({
          rank: 3,
          techStackId: 9,
          name: 'Svelte',
          trend: 'SAME',
          changeCount: 0,
        }),
      ],
    })

    expect(ranks).toEqual([
      { id: '3', name: 'React', count: 3123, trend: 'up', delta: 10 },
      { id: '7', name: 'Vue', count: 100, trend: 'down', delta: 12 },
      { id: '9', name: 'Svelte', count: 100, trend: 'flat', delta: 0 },
    ])
  })

  it('응답이 없으면 빈 목록', () => {
    expect(toStackRanks(undefined)).toEqual([])
  })
})

describe('toTrendHighlights', () => {
  it('상승·하락 순서로 카드를 만들고 방향은 변화율 부호를 따른다', () => {
    expect(
      toTrendHighlights(
        { skillId: 1, skillName: 'Next.js', changeRate: 74.2 },
        { skillId: 2, skillName: 'React', changeRate: -12.5 },
      ),
    ).toEqual([
      {
        label: '이번주 최대 상승',
        name: 'Next.js',
        trend: 'up',
        percent: 74.2,
      },
      {
        label: '이번주 최대 하락',
        name: 'React',
        trend: 'down',
        percent: -12.5,
      },
    ])
  })

  it('집계가 없거나(null) 아직 안 온(undefined) 쪽은 빠진다', () => {
    const decrease = { skillId: 2, skillName: 'React', changeRate: -12.5 }

    expect(toTrendHighlights(null, decrease).map(({ name }) => name)).toEqual([
      'React',
    ])
    expect(toTrendHighlights(undefined, null)).toEqual([])
  })
})

describe('toMentionBars', () => {
  it('두 주를 통틀어 가장 큰 건수를 100으로 둔 비율로 바꾼다', () => {
    expect(
      toMentionBars({
        mentions: [
          { name: 'React', previous: 200, current: 150 },
          { name: 'Vue', previous: 50, current: 0 },
        ],
      }),
    ).toEqual([
      { name: 'React', last: 100, current: 75 },
      { name: 'Vue', last: 25, current: 0 },
    ])
  })

  it('전부 0이어도 0으로 나누지 않는다', () => {
    expect(
      toMentionBars({ mentions: [{ name: 'React', previous: 0, current: 0 }] }),
    ).toEqual([{ name: 'React', last: 0, current: 0 }])
  })

  it('응답이 없으면 빈 목록', () => {
    expect(toMentionBars(undefined)).toEqual([])
  })
})

describe('toCollectedCount', () => {
  it('건수를 꺼내고 응답이 없으면 0', () => {
    expect(toCollectedCount({ count: 19283 })).toBe(19283)
    expect(toCollectedCount(undefined)).toBe(0)
  })
})
