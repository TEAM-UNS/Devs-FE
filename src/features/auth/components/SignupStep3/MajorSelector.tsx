import { memo, useCallback, useRef } from 'react'
import { ArrowIcon } from '@/shared/components/icons'
import { cn } from '@/shared/utils/cn'
import { MAX_MAJORS } from '../../types'
import { MAJORS, type Major } from './majors'

// 화살표 한 번에 스크롤할 거리 (카드 2개 + 간격).
const SCROLL_STEP = 232

// Figma arrow 에셋 fill = white.
const ARROW_BUTTON =
  'flex size-6 shrink-0 items-center justify-center text-white transition-opacity hover:opacity-70'

// 선택 카드 보라 글로우 (Figma 그림자1 = primary 60% blur 4px).
const SELECTED_GLOW = 'drop-shadow-[0px_0px_4px_rgba(188,114,244,0.6)]'

interface MajorCardProps {
  major: Major
  selected: boolean
  onToggle: (id: string) => void
}

const MajorCard = memo(function MajorCard({
  major,
  selected,
  onToggle,
}: MajorCardProps) {
  const handleClick = useCallback(
    () => onToggle(major.id),
    [onToggle, major.id],
  )
  const { Icon } = major

  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={handleClick}
      className={cn(
        'flex size-[100px] shrink-0 flex-col items-center justify-center gap-[3px]',
        'rounded-sm border bg-element transition-colors duration-fast ease-standard',
        selected
          ? cn('border-primary-500', SELECTED_GLOW)
          : 'border-transparent',
      )}
    >
      <Icon
        className={cn(
          'size-8',
          selected ? 'text-primary-500' : 'text-gray-300',
        )}
      />
      <span
        className={cn(
          'text-body-md',
          selected ? 'text-white' : 'text-gray-400',
        )}
      >
        {major.label}
      </span>
    </button>
  )
})

interface MajorSelectorProps {
  /** 선택된 전공 id 목록 */
  selected: string[]
  /** 전공 토글 콜백 */
  onToggle: (id: string) => void
}

/** 전공 선택 — 패널 안 가로 캐러셀 카드(다중선택 최대 MAX_MAJORS) + n/최대 카운터 + 좌우 스크롤. */
export function MajorSelector({ selected, onToggle }: MajorSelectorProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scrollLeft = useCallback(() => {
    scrollRef.current?.scrollBy({ left: -SCROLL_STEP, behavior: 'smooth' })
  }, [])
  const scrollRight = useCallback(() => {
    scrollRef.current?.scrollBy({ left: SCROLL_STEP, behavior: 'smooth' })
  }, [])

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between text-body-md">
        <span className="text-white">
          전공 선택 (최대 {MAX_MAJORS}개 다중 선택)
        </span>
        <span className="text-gray-300">
          <span className="text-primary-500">{selected.length}</span>
          {` / ${MAX_MAJORS}`}
        </span>
      </div>
      {/* 패널: 어두운 컨테이너 + 얇은 테두리 안에 화살표·카드 배치. */}
      <div className="rounded-md border border-element bg-container px-8 py-6">
        <div className="flex items-center gap-5">
          <button
            type="button"
            aria-label="이전 전공"
            onClick={scrollLeft}
            className={ARROW_BUTTON}
          >
            <ArrowIcon className="size-6" />
          </button>
          {/* py-2/-my-2: overflow가 세로로도 잘라 선택 글로우가 상하 클리핑되므로 세로 여유만 준다
              (좌우 패딩은 카드 폭을 잡아먹어 iOS가 잘리므로 두지 않음) */}
          <div
            ref={scrollRef}
            className="-my-2 flex flex-1 gap-4 overflow-x-auto scroll-smooth py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {MAJORS.map((major) => (
              <MajorCard
                key={major.id}
                major={major}
                selected={selected.includes(major.id)}
                onToggle={onToggle}
              />
            ))}
          </div>
          <button
            type="button"
            aria-label="다음 전공"
            onClick={scrollRight}
            className={ARROW_BUTTON}
          >
            <ArrowIcon className="size-6 rotate-180" />
          </button>
        </div>
      </div>
    </div>
  )
}
