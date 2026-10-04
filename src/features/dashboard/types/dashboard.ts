import type { ComponentType, SVGProps } from 'react'
import type { TrendDirection } from '@/shared/components/TrendMark'

/* 증감 방향은 표시 컴포넌트(shared/TrendMark)가 소유한다. 주간 리포트도 같은 표시를
   쓰게 되어 shared로 올렸고, 여기서는 기존 import 경로를 유지하려고 다시 내보낸다. */
export type { TrendDirection }

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

/**
 * 급상승 기술 스택 그래프의 시리즈 하나. 범례도 이 목록에서 그린다
 * (범례 색 순서와 영역 색 순서가 어긋나지 않게 하려고 한 곳에서 관리한다).
 */
export interface RisingSeries {
  id: string
  /** 범례 라벨. 데이터가 없으면 '-' */
  label: string
  /** 시점별 값. 비어 있으면 그래프 대신 '정보가 없습니다.'가 뜬다 */
  values: readonly number[]
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
  /** 급상승 그래프의 시점 라벨. 축엔 안 보이고 툴팁에만 쓰인다 (Figma 290:1004) */
  risingAxis: readonly string[]
  risingSeries: readonly RisingSeries[]
}
