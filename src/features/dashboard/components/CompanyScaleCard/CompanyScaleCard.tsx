import { ArrowIcon } from '@/shared/components/icons'
import { cn } from '@/shared/utils/cn'
import type { StackRank } from '../../types'
import { ChartCard } from '../ChartCard'
import { EmptyMessage } from '../EmptyMessage'

interface CompanyScaleCardProps {
  /** 현재 보고 있는 기업 규모 라벨 (예: '스타트업') */
  scale: string
  /** 양옆에 흐리게 보이는 이전·다음 규모 (Figma 1059:5839) */
  prevScale: string
  nextScale: string
  ranks: readonly StackRank[]
  /** 이전/다음 규모로 이동. 넘기지 않으면 화살표는 표시만 된다 */
  onStep?: (direction: -1 | 1) => void
}

// 순위별 게이지 색 — Figma 427:5437~5469 순서 그대로.
const GAUGE_COLORS = [
  'bg-chart-yellow',
  'bg-chart-mint',
  'bg-chart-cyan',
  'bg-chart-blue',
  'bg-primary-400',
] as const

// 규모 전환 버튼 — 반투명 흰 원 안에 셰브론 (Figma 274:1868 / 274:1870).
const STEP_BUTTON =
  'flex size-5 shrink-0 items-center justify-center rounded-full bg-white/10 text-gray-1000'

/**
 * 기업 규모별 기술 스택 분석 카드 — 규모 좌우 전환 + 순위별 가로 게이지.
 * 게이지는 진입 시 왼쪽에서 오른쪽으로 차오른다(Figma 274:1871 주석).
 */
export function CompanyScaleCard({
  scale,
  prevScale,
  nextScale,
  ranks,
  onStep,
}: CompanyScaleCardProps) {
  return (
    <ChartCard
      title="기업 규모별 기술 스택 분석"
      description="기업 규모별로 요구하는 기술 스택을 분석하여 그래프로 확인 할 수 있습니다."
      // gap-[19px]는 Figma 274:1862 값 그대로다 (4px 그리드에서 벗어난 값)
      className="gap-[19px]"
    >
      <div className="flex flex-col items-center gap-5">
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="이전 기업 규모"
            onClick={() => onStep?.(-1)}
            className={STEP_BUTTON}
          >
            <ArrowIcon className="size-full" />
          </button>
          {/* 이전·다음 규모는 바깥쪽으로 갈수록 흐려진다 — 글자에 흰 45%→투명 그라데이션을 입힌다
              화살표가 같은 일을 하므로 스크린리더에는 지금 규모만 읽힌다 */}
          <span
            aria-hidden="true"
            className="bg-linear-to-r from-white/0 to-white/45 bg-clip-text text-body-sm text-transparent"
          >
            {prevScale}
          </span>
          <span className="text-h2 text-gray-1000">{scale}</span>
          <span
            aria-hidden="true"
            className="bg-linear-to-r from-white/45 to-white/0 bg-clip-text text-body-sm text-transparent"
          >
            {nextScale}
          </span>
          <button
            type="button"
            aria-label="다음 기업 규모"
            onClick={() => onStep?.(1)}
            className={STEP_BUTTON}
          >
            <ArrowIcon className="size-full rotate-180" />
          </button>
        </div>

        {ranks.length === 0 ? (
          <EmptyMessage className="h-[152px] w-full" />
        ) : (
          // 게이지 목록은 카드 안에서 좌측 정렬된 420px (Figma 274:1871)
          <ol className="flex w-[420px] flex-col gap-2 self-start">
            {ranks.map(({ id, name, percent }, index) => (
              <li
                key={id}
                className="flex h-6 items-center gap-2 overflow-clip"
              >
                {/* tabular-nums로 자릿수 폭을 고정해 행마다 트랙 폭이 흔들리지 않게 한다 */}
                <span className="text-body-xs tabular-nums text-gray-400">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="w-[100px] truncate text-body-sm font-semibold text-gray-1000">
                  {name}
                </span>
                <span className="h-1.5 min-w-0 flex-1 overflow-clip rounded-[5px] bg-gray-200">
                  {/* 폭이 데이터로 결정되므로 말단 엘리먼트에 한해 inline style (CONVENTIONS §7 예외) */}
                  <span
                    className={cn(
                      'block h-full animate-gauge-grow rounded-[5px] motion-reduce:animate-none',
                      GAUGE_COLORS[index % GAUGE_COLORS.length],
                    )}
                    style={{ width: `${percent}%` }}
                  />
                </span>
                <span className="flex w-9 justify-center text-body-xs text-gray-400">
                  {percent}%
                </span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </ChartCard>
  )
}
