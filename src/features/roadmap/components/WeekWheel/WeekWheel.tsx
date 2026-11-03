import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { ChevronDownIcon } from '@/shared/components/icons'
import { cn } from '@/shared/utils/cn'
import { MAX_WEEKS, MIN_WEEKS } from '../../constants/create'
import {
  clampWeeks,
  slotOf,
  spinDuration,
  type SlotTone,
} from '../../utils/weekWheel'

interface WeekWheelProps {
  readonly weeks: number
  readonly onChange: (weeks: number) => void
}

const VALUES = Array.from(
  { length: MAX_WEEKS - MIN_WEEKS + 1 },
  (_, index) => MIN_WEEKS + index,
)

// 마우스 휠 한 칸(크롬 기준 deltaY 100)에 한 주. 트랙패드는 이만큼 쌓여야 한 주 넘어간다
const WHEEL_STEP = 100

// 현재 값은 display(SemiBold 흰색), 위아래는 h2·h4(Bold 회색) — Figma 571:4999·5012·5014
const TONE: Record<SlotTone, string> = {
  current: 'font-semibold text-white',
  near: 'font-bold text-gray-200',
  far: 'font-bold text-gray-100',
}

const pad = (value: number) => String(value).padStart(2, '0')

/* 숫자 기둥 높이 146.4 = 위 1칸(28.8) + 현재(57.6) + 아래 2칸(28.8, 19.2) + 간격 4×3
   현재 값의 가운데는 위에서 61.6 — 화살표(48)·'주'(27)도 이 선에 가운데를 맞춘다 */

/**
 * 기간(주) 숫자 드럼 — Figma 562:4550
 * 값이 바뀌면 숫자들이 제자리로 굴러가고, 크게 바뀔수록 더 오래 돈다
 * 휠·위아래 버튼·키보드(위/아래, Home/End)로 바꾼다
 */
export function WeekWheel({ weeks, onChange }: WeekWheelProps) {
  const wheelRef = useRef<HTMLDivElement>(null)
  // 바로 전 값과 비교해 굴러갈 시간을 정한다. 프리셋처럼 밖에서 바뀌어도 같이 적용된다
  const [previous, setPrevious] = useState(weeks)
  const [duration, setDuration] = useState(spinDuration(1))
  if (weeks !== previous) {
    setPrevious(weeks)
    setDuration(spinDuration(Math.abs(weeks - previous)))
  }

  const change = (next: number) => {
    const clamped = clampWeeks(next)
    if (clamped !== weeks) onChange(clamped)
  }

  /* React의 onWheel은 passive라 페이지 스크롤을 막을 수 없어 직접 단다
     값이 바뀔 때마다 다시 달아 최신 값을 기준으로 계산한다 */
  useEffect(() => {
    const element = wheelRef.current
    if (!element) return

    let accumulated = 0
    const handleWheel = (event: WheelEvent) => {
      event.preventDefault()
      accumulated += event.deltaY
      const steps = Math.trunc(accumulated / WHEEL_STEP)
      if (steps === 0) return
      accumulated -= steps * WHEEL_STEP
      const next = clampWeeks(weeks + steps)
      if (next !== weeks) onChange(next)
    }

    element.addEventListener('wheel', handleWheel, { passive: false })
    return () => element.removeEventListener('wheel', handleWheel)
  }, [weeks, onChange])

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    // 숫자가 아래로 갈수록 커지므로 화면 방향대로 ↑는 위 숫자(-1), ↓는 아래 숫자(+1)
    const next = {
      ArrowUp: weeks - 1,
      ArrowDown: weeks + 1,
      Home: MIN_WEEKS,
      End: MAX_WEEKS,
    }[event.key]
    if (next === undefined) return
    event.preventDefault()
    change(next)
  }

  return (
    <div ref={wheelRef} className="flex items-start gap-2">
      <div className="flex items-start">
        <div
          role="spinbutton"
          tabIndex={0}
          aria-label="로드맵 기간"
          aria-valuemin={MIN_WEEKS}
          aria-valuemax={MAX_WEEKS}
          aria-valuenow={weeks}
          aria-valuetext={`${weeks}주`}
          onKeyDown={handleKeyDown}
          className="relative h-[146.4px] w-[53px] rounded-sm focus-visible:outline-2 focus-visible:outline-primary-500"
        >
          {VALUES.map((value) => {
            const slot = slotOf(value - weeks)
            return (
              <span
                key={value}
                aria-hidden="true"
                className={cn(
                  'absolute top-[61.6px] left-0 w-full text-center text-display-md select-none',
                  'motion-safe:transition-[transform,opacity,color] motion-safe:ease-decelerate',
                  TONE[slot.tone],
                  !slot.visible && 'opacity-0',
                )}
                style={{
                  transform: `translateY(calc(-50% + ${slot.y}px)) scale(${slot.scale})`,
                  transitionDuration: `${duration}ms`,
                }}
              >
                {pad(value)}
              </span>
            )
          })}
        </div>
        <div className="mt-[37.6px] flex w-6 flex-col text-gray-200">
          {/* ▲는 위 숫자(작은 값), ▼는 아래 숫자(큰 값)로 간다 */}
          <button
            type="button"
            aria-label="한 주 줄이기"
            disabled={weeks <= MIN_WEEKS}
            onClick={() => change(weeks - 1)}
            className="hover:text-gray-300 disabled:opacity-40"
          >
            <ChevronDownIcon className="size-6 rotate-180" />
          </button>
          <button
            type="button"
            aria-label="한 주 늘리기"
            disabled={weeks >= MAX_WEEKS}
            onClick={() => change(weeks + 1)}
            className="hover:text-gray-300 disabled:opacity-40"
          >
            <ChevronDownIcon className="size-6" />
          </button>
        </div>
      </div>
      <span className="mt-[48px] text-body-lg text-gray-400">주</span>
    </div>
  )
}
