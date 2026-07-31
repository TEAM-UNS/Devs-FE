import type { ComponentType, SVGProps } from 'react'

/** KPI 카드의 증감 방향 — 상승 · 하강 · 변동 없음. */
export type TrendDirection = 'up' | 'down' | 'flat'

/** KPI 카드 하단 보조 문구. 가운데 `value`만 SemiBold로 강조된다. */
export interface KpiCaption {
  prefix: string
  value: string
  suffix: string
}

export interface KpiMetric {
  id: string
  label: string
  /** 큰 값. 데이터가 없으면 '-' */
  value: string
  /** 값 뒤 단위(건 · 개). 값이 숫자가 아니면 없다 */
  unit?: string
  icon: ComponentType<SVGProps<SVGSVGElement>>
  caption: KpiCaption
  /** 증감 표시. 생략하면 아이콘 없이 문구만 나온다 */
  trend?: TrendDirection
}

/**
 * 인기 기술 스택의 세로 막대 하나.
 * ⚠️ 아직 화면에 그려지지 않는다 — 막대 그래프를 ECharts로 옮기는 중이라
 * 데이터 모양만 먼저 잡아 둔 상태다.
 */
export interface StackBar {
  id: string
  label: string
  /** 막대 높이 비율(0~1). null이면 데이터 없음 → 회색 스텁으로 렌더된다 */
  ratio: number | null
}

/** 기업 규모별 기술 스택의 가로 게이지 한 줄. */
export interface StackRank {
  id: string
  name: string
  /** 게이지 채움 비율(0~100) */
  percent: number
}

/** 급상승 기술 스택 그래프의 범례 항목. 데이터가 없으면 label이 '-'. */
export interface RisingLegendItem {
  id: string
  label: string
}

/** 대시보드 한 화면이 필요로 하는 데이터 전부. */
export interface DashboardData {
  kpis: readonly KpiMetric[]
  stackFilters: readonly string[]
  selectedStackFilter: string
  popularStacks: readonly StackBar[]
  companyScale: string
  /** 빈 배열이면 '정보가 없습니다.'로 렌더된다 */
  companyRanks: readonly StackRank[]
  risingPeriods: readonly string[]
  selectedRisingPeriod: string
  risingLegend: readonly RisingLegendItem[]
  risingHasData: boolean
}
