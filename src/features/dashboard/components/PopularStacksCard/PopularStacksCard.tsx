import { Chip } from '@/shared/components/Chip'
import { CheckIcon } from '@/shared/components/icons'
import { ChartCard } from '../ChartCard'

interface PopularStacksCardProps {
  /** 필터 칩 라벨 목록 (첫 항목은 '전체') */
  filters: readonly string[]
  /** 현재 선택된 필터 라벨 */
  selectedFilter: string
  /** 필터 칩을 눌렀을 때 호출된다. 넘기지 않으면 칩은 선택 상태를 표시만 한다 */
  onSelectFilter?: (filter: string) => void
}

const CHECK_ICON = <CheckIcon className="size-full" />

/**
 * 인기 기술 스택 카드 — 직군 필터 칩 + 세로 막대 그래프.
 * 그래프 영역은 ECharts로 구현할 예정이라 지금은 자리만 잡아 둔다.
 */
export function PopularStacksCard({
  filters,
  selectedFilter,
  onSelectFilter,
}: PopularStacksCardProps) {
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
      {/*
        TODO: ECharts 세로 막대 그래프가 들어갈 자리.
        직전 CSS 구현에서 실측한 Figma(279:846 / 277:818) 치수 —
        · 막대 영역 990×120, 카드 안에서 가운데 정렬 · 위 여백 16px
        · 막대 폭 40px, 상단만 radius 2px, 9칸 균등 분할
        · 채움 linear-gradient(214.46deg, primary-700 2.25% → 600 15.3% → 400 65.67% → 200 115.48%)
        · 데이터 없는 항목은 height 12px · bg-element 스텁, 라벨은 '-'
        · 라벨 12px gray-400, 막대와 6px 간격 → 라벨까지 합쳐 160px
      */}
      <div className="h-[160px] w-full" />
    </ChartCard>
  )
}
