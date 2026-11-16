import { useQuery } from '@tanstack/react-query'
import { reportQueries } from '../api'
import type { WeekReport } from '../types'
import {
  toCollectedCount,
  toMentionBars,
  toStackRanks,
  toTrendHighlights,
  toWeekRange,
} from '../utils/reportMappers'
import { baseDateAt } from '../utils/weekRange'

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
  const baseDate = baseDateAt(offset)
  const major = majorId ?? undefined

  const popular = useQuery({
    ...reportQueries.popularTechStack(major, 'WEEK', baseDate),
    enabled,
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
  const weekRange = useQuery({
    ...reportQueries.weekRange(baseDate),
    enabled,
  })
  const summary = useQuery({
    ...reportQueries.llmReport(baseDate, major),
    enabled,
  })

  return {
    week: toWeekRange(weekRange.data),
    collectedCount: toCollectedCount(collected.data),
    ranks: toStackRanks(popular.data),
    highlights: toTrendHighlights(increase.data, decrease.data),
    mentions: toMentionBars(mentions.data),
    summary: summary.data?.llmReport ? [summary.data.llmReport] : [],
    // isPending은 요청을 끈(enabled: false) 이웃 카드에서도 켜져 있어 isLoading을 쓴다
    loading: {
      week: weekRange.isLoading,
      collected: collected.isLoading,
      ranks: popular.isLoading,
      // 두 카드 중 하나라도 오면 온 카드부터 보여 준다 — 한 구역이 늦어도 나머지는 먼저 보인다
      highlights: increase.isLoading && decrease.isLoading,
      mentions: mentions.isLoading,
      summary: summary.isLoading,
    },
  }
}
