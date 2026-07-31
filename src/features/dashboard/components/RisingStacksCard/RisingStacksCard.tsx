import { Chip } from '@/shared/components/Chip'
import { CheckIcon } from '@/shared/components/icons'
import { cn } from '@/shared/utils/cn'
import type { RisingLegendItem } from '../../types'
import { ChartCard } from '../ChartCard'
import { EmptyMessage } from '../EmptyMessage'

interface RisingStacksCardProps {
  /** 기간 토글 라벨 (예: ['1주', '한 달']) */
  periods: readonly string[]
  selectedPeriod: string
  /**
   * 기간 토글을 눌렀을 때 호출된다. 넘기지 않으면 선택 상태를 표시만 한다.
   * TODO: 기간 상태의 소유자가 정해지면 연결한다 (필터 칩과 같은 결정).
   */
  onSelectPeriod?: (period: string) => void
  legend: readonly RisingLegendItem[]
  /** 그래프 데이터 유무. false면 '정보가 없습니다.'만 표시한다 */
  hasData: boolean
}

// 범례 점 색 — Figma 274:1968~1977 순서 그대로.
const LEGEND_COLORS = [
  'bg-chart-yellow',
  'bg-chart-cyan',
  'bg-chart-blue',
  'bg-chart-mint',
] as const

const CHECK_ICON = <CheckIcon className="size-full" />

/**
 * 급상승 기술 스택 카드 — 기간 토글 + 영역 그래프 + 범례.
 * 그래프 영역은 ECharts로 구현할 예정이라 지금은 빈 박스로 자리만 잡아 둔다.
 */
export function RisingStacksCard({
  periods,
  selectedPeriod,
  onSelectPeriod,
  legend,
  hasData,
}: RisingStacksCardProps) {
  return (
    <ChartCard
      title="급상승 기술 스택"
      description="최근 한 달 동안 급상승한 기술을 그래프 형태로 확인할 수 있습니다."
      action={
        <div className="flex shrink-0 items-center gap-1.5">
          {periods.map((period) => {
            const selected = period === selectedPeriod
            return (
              <Chip
                key={period}
                size="small"
                selected={selected}
                icon={selected ? CHECK_ICON : undefined}
                onClick={
                  onSelectPeriod ? () => onSelectPeriod(period) : undefined
                }
              >
                {period}
              </Chip>
            )
          })}
        </div>
      }
    >
      <div className="flex min-h-0 flex-1 flex-col gap-1.5">
        {/*
          TODO: ECharts 영역 그래프가 들어갈 자리 (이 bg-canvas 박스 안).
          Figma(288:987) 치수 — 박스 542×172, 그래프 그룹은 155px 높이로 박스 바닥에 붙는다.
          4겹 영역이 mix-blend-screen으로 겹치고 각 겹은 세로 그라디언트에 opacity 0.55.
          범례 색 순서(chart-yellow / cyan / blue / mint)가 시리즈 순서와 같아야 한다.
          TODO: 마우스 위치에 따라 뜨는 툴팁(Figma 290:1014)도 여기에 붙인다.
        */}
        <div className="relative min-h-0 flex-1 overflow-clip rounded-sm bg-canvas">
          {!hasData && <EmptyMessage className="absolute inset-0" />}
        </div>
        <ul className="flex items-center gap-2">
          {legend.map(({ id, label }, index) => (
            <li key={id} className="flex items-center gap-1.5">
              <span
                className={cn(
                  'size-1.5 shrink-0 rounded-full',
                  LEGEND_COLORS[index % LEGEND_COLORS.length],
                )}
                aria-hidden="true"
              />
              <span className="text-body-xs text-gray-500">{label}</span>
            </li>
          ))}
        </ul>
      </div>
    </ChartCard>
  )
}
