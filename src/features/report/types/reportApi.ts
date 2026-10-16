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

export interface LlmReportResponse {
  /** 요약이 아직 생성 중이면 null */
  llmReport: string | null
}

/** GET /report/week-range — 기준일이 속한 주. 몇 월 몇 주차는 그 주 목요일 기준으로 서버가 정한다 */
export interface ReportWeekRangeResponse {
  year: number
  month: number
  week: number
  startDate: string
  endDate: string
}
