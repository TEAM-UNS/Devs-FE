import type { TrendDirection } from '@/shared/components/TrendMark'

export type * from './reportApi'

export type JobFilter = 'ALL' | 'FE' | 'BE' | 'SECURITY'

export interface WeekRange {
  label: string
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
  week: WeekRange
  collectedCount: number
  ranks: StackRank[]
  highlights: TrendHighlight[]
  mentions: MentionBar[]
  summary: string[]
}
