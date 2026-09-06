import { cn } from '@/shared/utils/cn'

/** 증감 방향. 이 표시가 쓰이는 곳(대시보드 KPI·주간 리포트 순위)이 공유한다. */
export type TrendDirection = 'up' | 'down' | 'flat'

// 상승=빨강 · 하강=파랑. 한국 시장 관행(적상청하)을 따른 Figma 디자인 그대로다.
// (Figma 상승 323:1639 = #ff7272 = error, 하강 323:1632 = #62caf4 = info)
const TRIANGLE_COLOR: Record<'up' | 'down', string> = {
  up: 'text-error',
  down: 'rotate-180 text-info',
}

/** 위를 향한 삼각형 — Figma `323:1639` export. 하강은 같은 도형을 180도 돌려 쓴다. */
const TRIANGLE_PATH = 'M5 0L10 9H0L5 0Z'

/** KPI 증감 표시 — 상승·하강은 삼각형, 변동 없음은 회색 가로 막대. */
export function TrendMark({ direction }: { direction: TrendDirection }) {
  if (direction === 'flat') {
    return (
      <span className="h-0.5 w-2.5 shrink-0 bg-gray-200" aria-hidden="true" />
    )
  }

  return (
    <svg
      viewBox="0 0 10 9"
      fill="none"
      aria-hidden="true"
      className={cn('h-[9px] w-2.5 shrink-0', TRIANGLE_COLOR[direction])}
    >
      <path d={TRIANGLE_PATH} fill="currentColor" />
    </svg>
  )
}
