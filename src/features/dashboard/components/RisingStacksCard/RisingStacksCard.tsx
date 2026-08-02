import { useRef, type MouseEvent } from 'react'
import { Chip } from '@/shared/components/Chip'
import { CheckIcon } from '@/shared/components/icons'
import { cn } from '@/shared/utils/cn'
import { useEChart } from '../../hooks/useEChart'
import type { RisingSeries } from '../../types'
import {
  buildRisingStacksOption,
  RISING_SERIES_PALETTE,
} from '../../utils/risingStacksOption'
import { ChartCard } from '../ChartCard'
import { EmptyMessage } from '../EmptyMessage'

interface RisingStacksCardProps {
  /** 기간 토글 라벨 (예: ['1주', '한 달']) */
  periods: readonly string[]
  selectedPeriod: string
  /** 기간 토글을 눌렀을 때 호출된다. 넘기지 않으면 선택 상태를 표시만 한다 */
  onSelectPeriod?: (period: string) => void
  /** 그래프 시리즈. 범례도 이 목록에서 그린다 */
  series: readonly RisingSeries[]
  /** 시점 라벨. 축엔 안 보이고 툴팁에만 쓰인다 */
  axisLabels: readonly string[]
}

const CHECK_ICON = <CheckIcon className="size-full" />

/** 급상승 기술 스택 카드 — 기간 토글 + ECharts 영역 그래프 + 범례. */
export function RisingStacksCard({
  periods,
  selectedPeriod,
  onSelectPeriod,
  series,
  axisLabels,
}: RisingStacksCardProps) {
  const hasData = series.some(({ values }) => values.length > 0)

  // 툴팁이 "가리키고 있는 시리즈 하나"를 고르려면 커서 위치가 필요하다.
  // state가 아니라 ref로 담는다 — 마우스가 움직일 때마다 리렌더하면 안 되기 때문이다.
  const cursor = useRef<{
    xRatio: number
    yRatio: number
    height: number
  } | null>(null)

  const chartRef = useEChart(
    buildRisingStacksOption(series, axisLabels, cursor),
  )

  // ⚠️ 반드시 캡처 단계여야 한다. 버블 단계로 두면 zrender가 canvas에서 먼저 툴팁을
  // 그린 뒤에야 ref가 갱신돼, 툴팁이 **직전 커서 위치**의 시리즈를 보여준다.
  const handleMouseMoveCapture = (event: MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } =
      event.currentTarget.getBoundingClientRect()

    cursor.current =
      width > 0 && height > 0
        ? {
            xRatio: (event.clientX - left) / width,
            yRatio: (event.clientY - top) / height,
            height,
          }
        : null
  }

  const handleMouseLeave = () => {
    cursor.current = null
  }

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
        {/* 툴팁은 박스 밖으로 나갈 수 있어야 하므로 overflow-clip을 걸지 않는다 */}
        <div className="relative min-h-0 flex-1 rounded-sm bg-canvas">
          {hasData ? (
            <div
              ref={chartRef}
              className="size-full"
              onMouseMoveCapture={handleMouseMoveCapture}
              onMouseLeave={handleMouseLeave}
            />
          ) : (
            <EmptyMessage className="absolute inset-0" />
          )}
        </div>
        <ul className="flex items-center gap-2">
          {series.map(({ id, label }, index) => (
            <li key={id} className="flex items-center gap-1.5">
              <span
                className={cn(
                  'size-1.5 shrink-0 rounded-full',
                  RISING_SERIES_PALETTE[index % RISING_SERIES_PALETTE.length]
                    .dotClass,
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
