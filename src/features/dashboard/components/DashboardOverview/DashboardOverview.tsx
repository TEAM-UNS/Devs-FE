import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { trackEvent } from '@/shared/analytics'
import { getAccessToken, majorLabel, majorQueries } from '@/shared/api'
import { dashboardQueries } from '../../api'
import { useFilterMode } from '../../hooks/useFilterMode'
import {
  ALL_MAJORS_LABEL,
  COMPANY_SIZES,
  RISING_PERIODS,
} from '../../utils/dashboardLabels'
import {
  DEFAULT_FILTERS,
  type DashboardFilters,
  loadFilters,
  saveFilters,
} from '../../utils/filterMemory'
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

/** 저장소가 막힌 환경(시크릿 모드 등)에서도 노출 이벤트가 깨지지 않게 로그인 여부를 읽는다 */
function isLoggedIn(): boolean {
  try {
    return Boolean(getAccessToken())
  } catch {
    return false
  }
}

/** 저장값이 기본값과 다른지 — 같으면 기억 모드여도 화면이 기본값과 같아 효과가 없다 */
function differsFromDefault(filters: DashboardFilters): boolean {
  return (
    filters.majorId !== DEFAULT_FILTERS.majorId ||
    filters.companySize !== DEFAULT_FILTERS.companySize ||
    filters.period !== DEFAULT_FILTERS.period
  )
}

/**
 * 메인페이지 본문 — KPI 카드 4장 + 차트 카드 3종.
 * 폭·간격은 Figma 290:1054(1120px 그리드) 기준이다.
 *
 * 필터 시작값은 원격 플래그(필터 기억 실험)로 정한다. 플래그는 기다리지 않는다(useFilterMode)
 */
export function DashboardOverview() {
  const { mode, flagSource } = useFilterMode()

  // 시작값은 처음 그릴 때 한 번만 정한다. 보고 있는 필터가 중간에 바뀌지 않게
  const [start] = useState(() => {
    const saved = loadFilters()
    const filters = mode === 'remember' && saved ? saved : DEFAULT_FILTERS
    return { saved, filters }
  })

  // 선택 상태를 카드가 아니라 이 조립 지점이 갖는 이유: 전공 필터가 막대뿐 아니라
  // 규모·급상승 조회까지 함께 바꾸므로, 상태가 그 카드들보다 위에 있어야 한다.
  // 값은 서버에 그대로 넘어가고, 쿼리 키에 들어가 있어 선택이 바뀌면 자동으로 다시 부른다.
  const [majorId, setMajorId] = useState(start.filters.majorId)
  const [companySize, setCompanySize] = useState(start.filters.companySize)
  const [period, setPeriod] = useState(start.filters.period)

  const majors = useQuery(majorQueries.list())
  // 칩 라벨은 회원가입과 같은 전공 표기를 쓴다. '전체'는 major_id를 안 보내는 경우다.
  const majorList = majors.data?.categories ?? []
  // 기억해 둔 전공이 목록에서 사라졌으면 전체로 본다
  const activeMajorId =
    majors.isSuccess && !majorList.some((major) => major.id === majorId)
      ? undefined
      : majorId

  const summary = useQuery(dashboardQueries.summary())
  const popular = useQuery(dashboardQueries.popular(activeMajorId))
  const companies = useQuery(
    dashboardQueries.companySize(companySize, activeMajorId),
  )
  const rising = useQuery(dashboardQueries.rising(period, activeMajorId))

  // 실험 노출 — 어떤 방식으로 어떤 값에서 시작했는지. 시작값은 바뀌지 않아 한 번만 보낸다
  // 저장값과 wouldDiffer는 A 방문에서도 남겨, 기억했다면 화면이 달라졌을 방문끼리 비교할 수 있게 한다
  // 회원만 리포트·챗봇으로 갈 수 있어 주 지표가 로그인 여부에 크게 흔들리므로 함께 남긴다
  useEffect(() => {
    trackEvent('Dashboard Viewed', {
      filterMode: mode,
      flagSource,
      loggedIn: isLoggedIn(),
      startMajorId: start.filters.majorId ?? null,
      startCompanySize: start.filters.companySize,
      startPeriod: start.filters.period,
      hadSaved: start.saved !== null,
      savedMajorId: start.saved?.majorId ?? null,
      savedCompanySize: start.saved?.companySize ?? null,
      savedPeriod: start.saved?.period ?? null,
      wouldDiffer: start.saved !== null && differsFromDefault(start.saved),
    })
  }, [mode, flagSource, start])

  // 직접 바꿀 때만 남긴다. 들어올 때 저장하면 기본값(A)이 마지막 선택을 덮어쓴다
  // A 기간에도 남겨 두어 B로 바뀐 첫날부터 기억이 동작한다
  const recordChange = <K extends keyof DashboardFilters>(
    filter: K,
    from: DashboardFilters[K],
    to: DashboardFilters[K],
  ) => {
    saveFilters({
      majorId: activeMajorId,
      companySize,
      period,
      [filter]: to,
    })
    trackEvent('Dashboard Filter Changed', {
      filterMode: mode,
      filter,
      from: from ?? null,
      to: to ?? null,
    })
  }

  const filters = [
    ALL_MAJORS_LABEL,
    ...majorList.map((major) => majorLabel(major.major)),
  ]
  const selected = majorList.find((major) => major.id === activeMajorId)
  const selectedFilter = selected
    ? majorLabel(selected.major)
    : ALL_MAJORS_LABEL

  const selectFilter = (label: string) => {
    const next = majorList.find(
      (major) => majorLabel(major.major) === label,
    )?.id
    if (next === activeMajorId) return
    setMajorId(next)
    recordChange('majorId', activeMajorId, next)
  }

  const stepCompanySize = (direction: -1 | 1) => {
    const current = COMPANY_SIZES.findIndex(
      (size) => size.value === companySize,
    )
    // 양 끝에서 반대편으로 돌아간다 — 화살표가 비활성되는 상태를 디자인이 두지 않았다.
    const next =
      COMPANY_SIZES[
        (current + direction + COMPANY_SIZES.length) % COMPANY_SIZES.length
      ].value
    setCompanySize(next)
    recordChange('companySize', companySize, next)
  }

  const selectPeriod = (label: string) => {
    const found = RISING_PERIODS.find((item) => item.label === label)
    if (!found || found.value === period) return
    setPeriod(found.value)
    recordChange('period', period, found.value)
  }

  const kpis = summary.data ? toKpiMetrics(summary.data) : NO_KPIS
  const bars = popular.data ? toStackBars(popular.data) : NO_BARS
  const ranks = companies.data ? toStackRanks(companies.data) : NO_RANKS
  const chart = rising.data ? toRisingChart(rising.data) : undefined

  const companySizeLabel =
    COMPANY_SIZES.find((size) => size.value === companySize)?.label ?? ''
  // 화살표가 양 끝에서 순환하므로 양옆에 보이는 규모도 순환한다
  const sizeIndex = COMPANY_SIZES.findIndex(
    (size) => size.value === companySize,
  )
  const neighborScale = (direction: -1 | 1) =>
    COMPANY_SIZES[
      (sizeIndex + direction + COMPANY_SIZES.length) % COMPANY_SIZES.length
    ].label
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
          prevScale={neighborScale(-1)}
          nextScale={neighborScale(1)}
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
