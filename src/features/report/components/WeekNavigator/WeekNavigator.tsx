import { ArrowIcon } from '@/shared/components/icons'
import type { WeekRange } from '../../types'

interface WeekNavigatorProps {
  week: WeekRange
  /** 이전/다음 주차로 이동. 넘기지 않으면 화살표는 표시만 된다 */
  onStep?: (direction: -1 | 1) => void
  /** 더 과거로 갈 수 있는지 (기본 true) */
  canPrevious?: boolean
  /** 더 미래로 갈 수 있는지 (기본 true) */
  canNext?: boolean
}

/* 주차 전환 버튼 — 반투명 흰 원 안에 화살표 (Figma 325:2413, 20px · white 10%).
   대시보드 `CompanyScaleCard`의 규모 전환 버튼과 같은 모양이다. 두 곳에서 쓰이지만
   지금은 클래스 문자열 하나라 공용으로 올리지 않았다 — 세 번째가 나오면 옮긴다.

   포커스 링은 Figma에 없지만 붙인다. 화살표 아이콘 세트에는 방향 변형만 있고
   hover·focus 상태가 없는데, 키보드로 조작할 때 어디에 있는지 보이지 않으면 안 된다.
   `Button`·`Chip`도 같은 이유로 Figma 밖에서 포커스 링을 더한다.
   ⚠️ hover 색은 Figma에 값이 없어 넣지 않았다 — 디자이너 확인이 필요하다. */
const STEP_BUTTON = [
  'flex size-5 shrink-0 items-center justify-center rounded-full',
  'bg-white/10 text-gray-1000',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
  // ⚠️ 비활성 모습도 Figma에 없다. 눌리지 않는다는 것만 드러나게 흐리기만 한다.
  'disabled:cursor-not-allowed disabled:opacity-40',
].join(' ')

/**
 * 주간 리포트 헤더 — `‹ 7월 2주차 ›`와 그 아래 날짜 범위.
 *
 * @param week 표시할 주차와 날짜 범위
 * @param onStep 주차 이동 핸들러 (없으면 화살표는 표시만 된다)
 * @param canPrevious 과거로 더 갈 수 있는지
 * @param canNext 미래로 더 갈 수 있는지
 */
export function WeekNavigator({
  week,
  onStep,
  canPrevious = true,
  canNext = true,
}: WeekNavigatorProps) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="이전 주차"
          onClick={() => onStep?.(-1)}
          disabled={!canPrevious}
          className={STEP_BUTTON}
        >
          <ArrowIcon className="size-full" />
        </button>
        {/* key: 라벨이 바뀔 때마다 다시 그려 페이드가 재생된다.
            버튼은 밖에 있어 다시 마운트되지 않으므로 포커스는 유지된다. */}
        <h1
          key={week.label}
          className="animate-label-swap text-h2 text-gray-1000 motion-reduce:animate-none"
        >
          {week.label}
        </h1>
        <button
          type="button"
          aria-label="다음 주차"
          onClick={() => onStep?.(1)}
          disabled={!canNext}
          className={STEP_BUTTON}
        >
          <ArrowIcon className="size-full rotate-180" />
        </button>
      </div>

      {/* 날짜는 표기용이라 하나의 문단으로 읽히게 둔다 (Figma는 세 조각이지만 의미는 한 덩어리) */}
      <p
        key={week.start}
        className="animate-label-swap text-body-sm text-gray-400 motion-reduce:animate-none"
      >
        {week.start} ~ {week.end}
      </p>
    </div>
  )
}
