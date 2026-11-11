import { useState } from 'react'
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
  /** 배치 조정용 클래스 (그리드 안 순서 등) */
  className?: string
}

// 순위별 게이지 색 — Figma 427:5437~5469 순서 그대로.
const GAUGE_COLORS = [
  'bg-chart-yellow',
  'bg-chart-mint',
  'bg-chart-cyan',
  'bg-chart-blue',
  'bg-primary-400',
] as const

/* 규모 전환 버튼 — 배경 없이 회색 셰브론만 (Figma 1059:5838 / 1059:5843, #495057)
   포커스 링은 Figma에 없지만 키보드 위치가 보여야 해서 주간리포트 WeekNavigator와 같이 붙인다 */
const STEP_BUTTON =
  'flex size-5 shrink-0 items-center justify-center rounded-full text-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500'

/* 라벨 자리 폭 — 가장 긴 4글자 라벨의 실측 폭(옆 14px 48.4px, 가운데 24px 볼드 83px).
   자리를 고정해야 넘길 때 이동 거리가 일정하고, 3글자 '대기업'이 와도 화살표가 들썩이지 않는다 */
const SIDE_SLOT = 'w-[49px] shrink-0 text-center'
const CENTER_SLOT = 'w-[83px] shrink-0 text-center'

// 옆 라벨은 바깥쪽으로 갈수록 흐려진다 — 글자에 흰 45%→투명 그라데이션을 입힌다
const PREV_LABEL =
  'bg-linear-to-r from-white/0 to-white/45 bg-clip-text text-body-sm text-transparent'
const NEXT_LABEL =
  'bg-linear-to-r from-white/45 to-white/0 bg-clip-text text-body-sm text-transparent'

/* 넘김 직후 각 라벨이 출발하는 모습 (index.css scale-slide-in/out)
   이동 거리: 옆↔가운데 자리 중심 78px(24.5 + 간격 12 + 41.5), 옆↔바깥 61px(49 + 12)
   크기: 옆 14px ↔ 가운데 24px 배율. 가운데로 오는 라벨은 흐린 옆 라벨 밝기(45%)에서 시작한다
   방향마다 값이 정해져 있어 인라인 style 대신 클래스로 둔다 */
const SLIDE = {
  1: {
    prev: '[--from-x:78px] [--from-scale:1.714]',
    center: '[--from-x:78px] [--from-scale:0.583] [--from-opacity:0.45]',
    next: '[--from-x:61px] [--from-opacity:0]',
    leaving: `left-0 [--to-x:-61px] ${PREV_LABEL}`,
  },
  [-1]: {
    prev: '[--from-x:-61px] [--from-opacity:0]',
    center: '[--from-x:-78px] [--from-scale:0.583] [--from-opacity:0.45]',
    next: '[--from-x:-78px] [--from-scale:1.714]',
    leaving: `right-0 [--to-x:61px] ${NEXT_LABEL}`,
  },
} as const

const SLIDE_IN = 'animate-scale-slide-in motion-reduce:animate-none'

interface Slide {
  /** 넘길 때마다 올려 라벨 줄을 다시 마운트한다 — 연달아 눌러도 애니메이션이 처음부터 돈다 */
  readonly count: number
  readonly direction: -1 | 1
  /** 반대쪽 끝에서 밀려나 사라지는 라벨 */
  readonly leaving: string
}

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
  className,
}: CompanyScaleCardProps) {
  // 처음 그릴 때는 넘김이 없어 라벨이 제자리에 있다
  const [slide, setSlide] = useState<Slide | null>(null)
  const motion = slide && SLIDE[slide.direction]

  function step(direction: -1 | 1) {
    if (!onStep) return
    setSlide((current) => ({
      count: (current?.count ?? 0) + 1,
      direction,
      leaving: direction === 1 ? prevScale : nextScale,
    }))
    onStep(direction)
  }

  return (
    <ChartCard
      title="기업 규모별 기술 스택 분석"
      description="기업 규모별로 요구하는 기술 스택을 분석하여 그래프로 확인 할 수 있습니다."
      // gap-[19px]는 Figma 274:1862 값 그대로다 (4px 그리드에서 벗어난 값)
      className={cn('gap-[19px]', className)}
    >
      <div className="flex flex-col items-center gap-5">
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="이전 기업 규모"
            onClick={() => step(-1)}
            className={STEP_BUTTON}
          >
            <ArrowIcon className="size-full" />
          </button>
          {/* 화살표가 같은 일을 하므로 스크린리더에는 지금 규모만 읽힌다
              라벨 줄만 다시 마운트한다 — 화살표까지 바꾸면 키보드 포커스가 사라진다 */}
          <div
            key={slide?.count}
            className="relative flex items-center gap-3 overflow-clip"
          >
            {slide && (
              <span
                aria-hidden="true"
                className={cn(
                  'absolute animate-scale-slide-out motion-reduce:hidden',
                  SIDE_SLOT,
                  motion?.leaving,
                )}
              >
                {slide.leaving}
              </span>
            )}
            <span
              aria-hidden="true"
              className={cn(
                SIDE_SLOT,
                PREV_LABEL,
                motion && [SLIDE_IN, motion.prev],
              )}
            >
              {prevScale}
            </span>
            <span
              className={cn(
                CENTER_SLOT,
                'text-h2 text-gray-1000',
                motion && [SLIDE_IN, motion.center],
              )}
            >
              {scale}
            </span>
            <span
              aria-hidden="true"
              className={cn(
                SIDE_SLOT,
                NEXT_LABEL,
                motion && [SLIDE_IN, motion.next],
              )}
            >
              {nextScale}
            </span>
          </div>
          <button
            type="button"
            aria-label="다음 기업 규모"
            onClick={() => step(1)}
            className={STEP_BUTTON}
          >
            <ArrowIcon className="size-full rotate-180" />
          </button>
        </div>

        {ranks.length === 0 ? (
          <EmptyMessage className="h-[152px] w-full" />
        ) : (
          // 게이지 목록은 카드 안에서 좌측 정렬된 420px (Figma 274:1871)
          <ol className="flex w-full max-w-[420px] flex-col gap-2 self-start">
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
                      // 다시 본 규모처럼 같은 기술이 남아 있으면 폭만 바뀌므로 그 변화도 부드럽게
                      'motion-safe:transition-[width] motion-safe:duration-slow motion-safe:ease-decelerate',
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
