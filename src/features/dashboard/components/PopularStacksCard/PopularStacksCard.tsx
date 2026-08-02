import { Chip } from '@/shared/components/Chip'
import { CheckIcon } from '@/shared/components/icons'
import { useEChart } from '../../hooks/useEChart'
import type { StackBar } from '../../types'
import { buildPopularStacksOption } from '../../utils/popularStacksOption'
import { ChartCard } from '../ChartCard'

interface PopularStacksCardProps {
  /** 필터 칩 라벨 목록 (첫 항목은 '전체') */
  filters: readonly string[]
  /** 현재 선택된 필터 라벨 */
  selectedFilter: string
  /** 필터 칩을 눌렀을 때 호출된다. 넘기지 않으면 칩은 선택 상태를 표시만 한다 */
  onSelectFilter?: (filter: string) => void
  bars: readonly StackBar[]
}

const CHECK_ICON = <CheckIcon className="size-full" />

/** 인기 기술 스택 카드 — 직군 필터 칩 + ECharts 세로 막대 그래프. */
export function PopularStacksCard({
  filters,
  selectedFilter,
  onSelectFilter,
  bars,
}: PopularStacksCardProps) {
  const chartRef = useEChart(buildPopularStacksOption(bars))

  return (
    <ChartCard
      title="인기 기술 스택"
      description="현재 가장 인기있는 기술 스택들을 그래프로 확인할 수 있습니다."
      className="h-[280px]"
      action={
        <div className="flex flex-wrap justify-end gap-1.5">
          {filters.map((filter) => {
            const selected = filter === selectedFilter
            return (
              <Chip
                key={filter}
                size="small"
                selected={selected}
                icon={selected ? CHECK_ICON : undefined}
                onClick={
                  onSelectFilter ? () => onSelectFilter(filter) : undefined
                }
              >
                {filter}
              </Chip>
            )
          })}
        </div>
      }
    >
      {/* 막대 영역 990×120 + 위 16 + 라벨 24 = 160 (치수는 buildPopularStacksOption의 grid가 맞춘다) */}
      <div ref={chartRef} className="h-[160px] w-full" />
    </ChartCard>
  )
}
