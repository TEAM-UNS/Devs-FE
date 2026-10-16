import type { TrendDirection } from '@/shared/components/TrendMark'

export type * from './reportApi'

/** 전공 필터 칩 하나. `value`가 `null`이면 '전체'(전공 필터 없음) */
export interface MajorOption {
  value: number | null
  label: string
}

/** 헤더·요약 제목에 쓰는 주차. 서버 week-range 응답으로 만든다 */
export interface WeekRange {
  year: number
  /** `7월 2주차` */
  label: string
  /** `2026.07.06` */
  start: string
  end: string
}

export interface StackRank {
  id: string
  name: string
  count: number
  trend: TrendDirection
  /** 방향과 별도로 표시하는 증감 절댓값. */
  delta: number
}

export interface TrendHighlight {
  label: string
  name: string
  trend: TrendDirection
  percent: number
}

export interface MentionBar {
  name: string
  /** 지난주 언급량 비율. */
  last: number
  /** 이번 주 언급량 비율. */
  current: number
}

export interface WeekReport {
  /** week-range 응답 전에는 없다 */
  week?: WeekRange
  collectedCount: number
  ranks: StackRank[]
  highlights: TrendHighlight[]
  mentions: MentionBar[]
  summary: string[]
}
