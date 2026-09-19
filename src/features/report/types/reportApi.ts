export type ReportPeriod = 'WEEK' | 'MONTH'

export type ReportTrend = 'UP' | 'DOWN' | 'SAME'

export interface PopularTechStackItemDto {
  rank: number
  techStackId: number
  name: string
  searchCount: number
  previousSearchCount: number
  changeCount: number
  /** 지난주 대비 증감률(%)인데 지난주 건수가 0이면 null */
  changeRate: number | null
  trend: ReportTrend
}

export interface PopularTechStackResponse {
  majorId: number
  period: ReportPeriod
  baseDate: string
  items: PopularTechStackItemDto[]
}

export interface TechTrendResponse {
  skillId: number
  skillName: string
  changeRate: number
}

export interface TechMentionDto {
  name: string
  previous: number
  current: number
}

export interface TechMentionsResponse {
  mentions: TechMentionDto[]
}

export interface WeeklyCollectedCountResponse {
  count: number
}

export interface EarliestPostingDateResponse {
  /** 공고가 없으면 `null` */
  earliestPostingDate: string | null
}
