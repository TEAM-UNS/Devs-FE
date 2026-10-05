import { useQuery } from '@tanstack/react-query'
import { reportQueries } from '../api'
import type { WeekReport } from '../types'
import {
  toCollectedCount,
  toMentionBars,
  toStackRanks,
  toTrendHighlights,
} from '../utils/reportMappers'
import { weekRangeAt } from '../utils/weekRange'

/**
 * 한 주치 리포트를 불러와 카드 모양으로 바꾼다
 * 쿼리마다 따로 그린다 — 하나라도 늦거나 실패하면 그 구역만 빈 상태로 남고 나머지는 먼저 보인다
 *
 * @param offset 이번 주로부터의 주 단위 거리
 * @param majorId 전공 id. `null`이면 전체
 * @param enabled 볼 수 없는 주차(미래·하한 너머)의 이웃 카드는 요청하지 않는다
 */
export function useWeekReport(
  offset: number,
  majorId: number | null,
  enabled = true,
): WeekReport {
  const week = weekRangeAt(offset)
  const { baseDate } = week
  const major = majorId ?? undefined

  const popular = useQuery({
    ...reportQueries.popularTechStack(major, 'WEEK', baseDate),
    // 서버가 아직 major_id를 필수로 받아 '전체'로는 부르지 않는다(선택값으로 바꾸도록 요청함)
    // 서버가 바뀌면 `major !== undefined` 조건만 지우면 된다
    enabled: enabled && major !== undefined,
  })
  const increase = useQuery({
    ...reportQueries.maxIncrease(baseDate, major),
    enabled,
  })
  const decrease = useQuery({
    ...reportQueries.maxDecrease(baseDate, major),
    enabled,
  })
  const mentions = useQuery({
    ...reportQueries.techMentions(baseDate, major),
    enabled,
  })
  const collected = useQuery({
    ...reportQueries.weeklyCollectedCount(baseDate),
    enabled,
  })

  return {
    week,
    collectedCount: toCollectedCount(collected.data),
    ranks: toStackRanks(popular.data),
    highlights: toTrendHighlights(increase.data, decrease.data),
    mentions: toMentionBars(mentions.data),
    // AI 요약은 리포트 id로만 조회되는데 주차로 id를 찾을 방법이 없어 비워 둔다
    summary: [],
  }
}
