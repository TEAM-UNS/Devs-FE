import type { TrendDirection } from '@/shared/components/TrendMark'
import type {
  MentionBar,
  PopularTechStackResponse,
  ReportTrend,
  StackRank,
  TechMentionsResponse,
  TechTrendResponse,
  TrendHighlight,
  WeeklyCollectedCountResponse,
} from '../types'

const TREND_DIRECTION: Record<ReportTrend, TrendDirection> = {
  UP: 'up',
  DOWN: 'down',
  SAME: 'flat',
}

/** 인기 기술 스택 응답을 순위 목록으로 바꾼다. 목록 순서가 곧 순위라 rank로 정렬한다 */
export function toStackRanks(
  response: PopularTechStackResponse | undefined,
): StackRank[] {
  if (!response) return []

  return [...response.items]
    .sort((a, b) => a.rank - b.rank)
    .map((item) => ({
      id: String(item.techStackId),
      name: item.name,
      count: item.searchCount,
      trend: TREND_DIRECTION[item.trend],
      // 방향은 삼각형이 보여주므로 숫자는 절댓값이다
      delta: Math.abs(item.changeCount),
    }))
}

const directionOf = (rate: number): TrendDirection =>
  rate > 0 ? 'up' : rate < 0 ? 'down' : 'flat'

/** 최대 상승·하락 응답을 강조 카드로 바꾼다. 집계가 없는(null) 쪽은 빠진다 */
export function toTrendHighlights(
  increase: TechTrendResponse | null | undefined,
  decrease: TechTrendResponse | null | undefined,
): TrendHighlight[] {
  const cards = [
    { label: '이번주 최대 상승', response: increase },
    { label: '이번주 최대 하락', response: decrease },
  ]

  return cards.flatMap(({ label, response }) =>
    response
      ? [
          {
            label,
            name: response.skillName,
            // 서버가 소수 한 자리로 반올림해 주고, 하락은 음수로 온다
            trend: directionOf(response.changeRate),
            percent: response.changeRate,
          },
        ]
      : [],
  )
}

/**
 * 언급량 응답을 막대 높이로 바꾼다
 * 서버는 공고 건수를 주는데 차트는 0~100 비율을 받으므로, 두 주를 통틀어 가장 큰 값을
 * 100으로 둔다 — 지난 주와 이번 주 막대를 같은 눈금으로 비교해야 해서 주별로 나누지 않는다
 */
export function toMentionBars(
  response: TechMentionsResponse | undefined,
): MentionBar[] {
  if (!response) return []

  const max = Math.max(
    0,
    ...response.mentions.flatMap(({ previous, current }) => [
      previous,
      current,
    ]),
  )
  const ratio = (value: number) =>
    max === 0 ? 0 : Math.round((value / max) * 100)

  return response.mentions.map(({ name, previous, current }) => ({
    name,
    last: ratio(previous),
    current: ratio(current),
  }))
}

/** 수집 공고 수 응답에서 건수만 꺼낸다. 아직 없으면 0 */
export function toCollectedCount(
  response: WeeklyCollectedCountResponse | undefined,
): number {
  return response?.count ?? 0
}
