import {
  BuildingIcon,
  ChartLineIcon,
  FlameIcon,
  MegaphoneIcon,
} from '@/shared/components/icons'
import type {
  BestTechStacksResponse,
  CompanySizeTechStacksResponse,
  DashboardSummaryResponse,
  KpiMetric,
  PopularTechStacksResponse,
  RisingSeries,
  StackBar,
  StackRank,
  TrendDirection,
} from '../types'
import { formatAxisDate } from './dashboardLabels'

/* 데이터가 없을 때의 표기 — 카드 전체에서 같은 규칙을 쓴다. */
const NO_VALUE = '-'

/** 증감 부호를 붙인다. 0은 부호 없이 그대로 둔다. */
function withSign(diff: number): string {
  return diff > 0 ? `+${diff}` : String(diff)
}

/** 증감 방향. 0이면 회색 막대(flat)로 표시된다. */
function directionOf(diff: number): TrendDirection {
  if (diff > 0) return 'up'
  if (diff < 0) return 'down'
  return 'flat'
}

/**
 * 요약 응답을 KPI 카드 4장으로 옮긴다.
 *
 * 라벨·아이콘·보조 문구는 서버가 주지 않아 화면이 고정으로 들고 있다(Figma 178:1987).
 * 최다 언급·최대 상승은 집계 대상이 없으면 `name`이 null로 오므로 그때는 '-'로 둔다.
 *
 * @param summary GET /dashboard/summary 응답
 * @returns KPI 카드 데이터
 */
export function toKpiMetrics(summary: DashboardSummaryResponse): KpiMetric[] {
  const { mostMentionedTech: mentioned, mostRisingTech: rising } = summary

  return [
    {
      id: 'collected-postings',
      label: '오늘 수집된 공고',
      value: String(summary.todayCollectedCount),
      unit: '건',
      icon: MegaphoneIcon,
      caption: {
        prefix: '전일 대비',
        value: withSign(summary.todayDiff),
        suffix: '건',
      },
      trend: directionOf(summary.todayDiff),
    },
    {
      id: 'active-companies',
      label: '활성 채용 기업',
      value: String(summary.activeCompanyCount),
      unit: '개',
      icon: BuildingIcon,
      caption: {
        prefix: '전주 대비',
        value: withSign(summary.companyDiff),
        suffix: '건',
      },
      trend: directionOf(summary.companyDiff),
    },
    {
      id: 'most-mentioned',
      label: '이번주 최다 언급',
      value: mentioned.name ?? NO_VALUE,
      icon: FlameIcon,
      caption: {
        prefix: '공고',
        value: String(mentioned.count),
        suffix: '건에 등장',
      },
    },
    {
      id: 'biggest-riser',
      label: '이번주 최대 상승',
      value: rising.name ?? NO_VALUE,
      icon: ChartLineIcon,
      caption: {
        prefix: '전주 대비',
        value: withSign(rising.rate),
        suffix: '%',
      },
      trend: directionOf(rising.rate),
    },
  ]
}

/**
 * 인기 기술 스택을 막대로 옮긴다.
 *
 * 서버는 등장 횟수를 주고 막대는 비율(0~1)로 그리므로 최댓값을 1로 두고 나눈다
 * — 절대 수치가 아니라 서로 간의 크기 비교를 보여주는 그래프다.
 *
 * @param response GET /dashboard/popular-tech-stacks 응답
 * @returns 막대 데이터
 */
export function toStackBars(response: PopularTechStacksResponse): StackBar[] {
  const max = Math.max(...response.techStacks.map((s) => s.count), 0)

  return response.techStacks.map((stack) => ({
    id: String(stack.techStackId),
    label: stack.name,
    ratio: max > 0 ? stack.count / max : null,
  }))
}

/**
 * 기업 규모별 기술 스택을 가로 게이지로 옮긴다. 서버가 이미 퍼센트로 준다.
 *
 * @param response GET /dashboard/company-size-tech-stacks 응답
 * @returns 게이지 데이터
 */
export function toStackRanks(
  response: CompanySizeTechStacksResponse,
): StackRank[] {
  return response.techStacks.map((stack) => ({
    id: `${stack.rank}-${stack.name}`,
    name: stack.name,
    percent: stack.percentage,
  }))
}

/**
 * 급상승 응답을 그래프 시리즈와 시점 라벨로 나눈다.
 *
 * 시리즈마다 자기 시점을 들고 오지만 그래프의 x축은 하나뿐이라, 첫 시리즈의
 * 날짜를 축으로 삼는다(서버가 같은 구간을 집계해 주는 전제).
 *
 * @param response GET /dashboard/best-tech-stacks 응답
 * @returns 시리즈와 축 라벨
 */
export function toRisingChart(response: BestTechStacksResponse): {
  series: RisingSeries[]
  axisLabels: string[]
} {
  const [first] = response.techStacks

  return {
    series: response.techStacks.map((stack) => ({
      id: String(stack.techStackId),
      label: stack.name,
      values: stack.values.map((point) => point.value),
    })),
    axisLabels: (first?.values ?? []).map((point) =>
      formatAxisDate(point.date),
    ),
  }
}
