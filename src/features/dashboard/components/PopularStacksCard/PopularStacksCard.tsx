import type { CSSProperties } from 'react'
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
      // 설명을 빼고 필터 칩을 한 줄에 둔다. 좁아지면 줄을 넘기지 않고 가로로 스크롤한다
      // 모바일은 칩이 제목 아래로 내려간다 (Figma 390 프레임)
      className="md:h-[264px]"
      headerClassName="max-md:flex-col max-md:gap-2"
      action={
        <div className="flex max-w-full min-w-0 gap-1.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {filters.map((filter) => {
            const selected = filter === selectedFilter
            return (
              <Chip
                key={filter}
                className="shrink-0"
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
      {/* 막대 영역 120 + 라벨 24 = 144 (치수는 buildPopularStacksOption의 grid가 맞춘다)
          모바일은 막대 한 칸이 60px 아래로 줄지 않고 가로로 스크롤한다 (Figma 390 프레임 min-w 60)
          mt-auto: 카드 높이(264)는 설명까지 있는 Figma 헤더 기준이라, 남는 높이는 헤더 아래로 몬다 */}
      <div className="mt-auto overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div
          className="relative min-w-[calc(var(--bar-count)*60px)] md:min-w-0"
          // 막대 개수는 데이터로 정해져 말단 엘리먼트에 한해 inline style을 쓴다 (CONVENTIONS §7 예외)
          style={{ '--bar-count': bars.length } as CSSProperties}
        >
          {/* 막대를 묶는 어두운 상자 (Figma bg/canvas, radius/sm). 라벨은 상자 밖 아래에 놓인다
              캔버스로 그리면 모서리를 둥글게 할 수 없어 차트 뒤에 CSS로 깐다 */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-[120px] rounded-sm bg-canvas"
          />
          <div ref={chartRef} className="relative h-[144px] w-full" />
        </div>
      </div>
    </ChartCard>
  )
}
