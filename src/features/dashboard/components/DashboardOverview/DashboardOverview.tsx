import { useState } from 'react'
import type { DashboardData } from '../../types'
import { CompanyScaleCard } from '../CompanyScaleCard'
import { KpiCard } from '../KpiCard'
import { PopularStacksCard } from '../PopularStacksCard'
import { RisingStacksCard } from '../RisingStacksCard'
import { DASHBOARD_MOCK } from './mockDashboard'

interface DashboardOverviewProps {
  /** 화면에 뿌릴 데이터. 생략하면 목데이터를 쓴다 (API 연동 시 필수로 바뀐다) */
  data?: DashboardData
}

/**
 * 메인페이지 본문 — KPI 카드 4장 + 차트 카드 3종.
 * 폭·간격은 Figma 290:1054(1120px 그리드) 기준이다.
 */
export function DashboardOverview({
  data = DASHBOARD_MOCK,
}: DashboardOverviewProps) {
  // 선택 상태를 카드가 아니라 이 조립 지점이 갖는 이유: 직군 필터가 막대뿐 아니라
  // KPI·급상승 그래프까지 바꾸므로, 상태가 KPI보다 위에 있어야 한다.
  // 서버와의 계약이 아직 없어 로컬 state로 두고 단일 선택만 지원한다. 서버에 필터를
  // 넘기는 방식으로 결정되면 이 두 state가 쿼리 키(또는 URL 쿼리)로 옮겨갈 자리다.
  const [selectedFilter, setSelectedFilter] = useState(data.selectedStackFilter)
  const [selectedPeriod, setSelectedPeriod] = useState(
    data.selectedRisingPeriod,
  )

  // TODO: 선택이 바뀌면 KPI·막대·그래프 데이터가 함께 바뀌어야 한다. 데이터 출처가
  // 미정이라 지금은 같은 목데이터를 계속 보여준다 (선택 표시만 반영된다).
  return (
    <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-6">
      <div className="grid grid-cols-4 gap-4">
        {data.kpis.map((kpi) => (
          <KpiCard key={kpi.id} {...kpi} />
        ))}
      </div>

      <PopularStacksCard
        filters={data.stackFilters}
        selectedFilter={selectedFilter}
        onSelectFilter={setSelectedFilter}
        bars={data.popularStacks}
      />

      {/* 하단 두 카드의 폭 비율(490:606)과 높이(316)는 Figma 290:1052 그대로 */}
      <div className="grid h-[316px] grid-cols-[490fr_606fr] gap-6">
        <CompanyScaleCard scale={data.companyScale} ranks={data.companyRanks} />
        <RisingStacksCard
          periods={data.risingPeriods}
          selectedPeriod={selectedPeriod}
          onSelectPeriod={setSelectedPeriod}
          series={data.risingSeries}
          axisLabels={data.risingAxis}
        />
      </div>
    </div>
  )
}
