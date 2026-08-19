import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { majorQueries } from '@/shared/api'
import { dashboardQueries } from '../../api'
import type { CompanySize, RisingPeriod } from '../../types'
import {
  ALL_MAJORS_LABEL,
  COMPANY_SIZES,
  RISING_PERIODS,
} from '../../utils/dashboardLabels'
import {
  toKpiMetrics,
  toRisingChart,
  toStackBars,
  toStackRanks,
} from '../../utils/toDashboardData'
import { CompanyScaleCard } from '../CompanyScaleCard'
import { KpiCard } from '../KpiCard'
import { PopularStacksCard } from '../PopularStacksCard'
import { RisingStacksCard } from '../RisingStacksCard'

// 응답이 오기 전/실패했을 때 넘길 빈 값 — 렌더마다 새로 만들지 않는다.
const NO_KPIS: ReturnType<typeof toKpiMetrics> = []
const NO_BARS: ReturnType<typeof toStackBars> = []
const NO_RANKS: ReturnType<typeof toStackRanks> = []
const NO_SERIES: ReturnType<typeof toRisingChart>['series'] = []
const NO_AXIS: string[] = []

const PERIOD_LABELS = RISING_PERIODS.map((period) => period.label)

/**
 * 메인페이지 본문 — KPI 카드 4장 + 차트 카드 3종.
 * 폭·간격은 Figma 290:1054(1120px 그리드) 기준이다.
 */
export function DashboardOverview() {
  // 선택 상태를 카드가 아니라 이 조립 지점이 갖는 이유: 전공 필터가 막대뿐 아니라
  // 규모·급상승 조회까지 함께 바꾸므로, 상태가 그 카드들보다 위에 있어야 한다.
  // 값은 서버에 그대로 넘어가고, 쿼리 키에 들어가 있어 선택이 바뀌면 자동으로 다시 부른다.
  const [majorId, setMajorId] = useState<number>()
  const [companySize, setCompanySize] = useState<CompanySize>('STARTUP')
  const [period, setPeriod] = useState<RisingPeriod>('MONTH')

  const majors = useQuery(majorQueries.list())
  const summary = useQuery(dashboardQueries.summary())
  const popular = useQuery(dashboardQueries.popular(majorId))
  const companies = useQuery(dashboardQueries.companySize(companySize, majorId))
  const rising = useQuery(dashboardQueries.rising(period, majorId))

  // 칩 라벨은 서버가 준 전공 이름을 그대로 쓴다. '전체'는 major_id를 안 보내는 경우다.
  const majorList = majors.data?.categories ?? []
  const filters = [ALL_MAJORS_LABEL, ...majorList.map((major) => major.major)]
  const selectedFilter =
    majorList.find((major) => major.id === majorId)?.major ?? ALL_MAJORS_LABEL

  const selectFilter = (label: string) => {
    setMajorId(majorList.find((major) => major.major === label)?.id)
  }

  const stepCompanySize = (direction: -1 | 1) => {
    const current = COMPANY_SIZES.findIndex(
      (size) => size.value === companySize,
    )
    // 양 끝에서 반대편으로 돌아간다 — 화살표가 비활성되는 상태를 디자인이 두지 않았다.
    const next =
      (current + direction + COMPANY_SIZES.length) % COMPANY_SIZES.length
    setCompanySize(COMPANY_SIZES[next].value)
  }

  const selectPeriod = (label: string) => {
    const found = RISING_PERIODS.find((item) => item.label === label)
    if (found) setPeriod(found.value)
  }

  const kpis = summary.data ? toKpiMetrics(summary.data) : NO_KPIS
  const bars = popular.data ? toStackBars(popular.data) : NO_BARS
  const ranks = companies.data ? toStackRanks(companies.data) : NO_RANKS
  const chart = rising.data ? toRisingChart(rising.data) : undefined

  const companySizeLabel =
    COMPANY_SIZES.find((size) => size.value === companySize)?.label ?? ''
  const periodLabel =
    RISING_PERIODS.find((item) => item.value === period)?.label ?? ''

  return (
    <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-6">
      <div className="grid grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.id} {...kpi} />
        ))}
      </div>

      <PopularStacksCard
        filters={filters}
        selectedFilter={selectedFilter}
        onSelectFilter={selectFilter}
        bars={bars}
      />

      {/* 하단 두 카드의 폭 비율(490:606)과 높이(316)는 Figma 290:1052 그대로 */}
      <div className="grid h-[316px] grid-cols-[490fr_606fr] gap-6">
        <CompanyScaleCard
          scale={companySizeLabel}
          ranks={ranks}
          onStep={stepCompanySize}
        />
        <RisingStacksCard
          periods={PERIOD_LABELS}
          selectedPeriod={periodLabel}
          onSelectPeriod={selectPeriod}
          series={chart?.series ?? NO_SERIES}
          axisLabels={chart?.axisLabels ?? NO_AXIS}
        />
      </div>
    </div>
  )
}
