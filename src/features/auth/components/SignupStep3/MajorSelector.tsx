import { memo, useCallback } from 'react'
import { CheckIcon } from '@/shared/components/icons'
import { cn } from '@/shared/utils/cn'
import { MAX_MAJORS } from '../../types'
import type { MajorOption } from './majors'

// 모바일은 칩, md 이상은 아이콘 카드다 (Figma 390 / 834·1920 프레임).
// 칩과 카드를 따로 그리면 같은 버튼이 두 벌 생겨 스크린리더·테스트가 둘 다 읽는다 → 버튼 하나를 클래스로 바꾼다
const CARD_BASE = [
  'flex items-center justify-center text-body-md',
  'transition-colors duration-fast ease-standard',
  'h-8 gap-1 rounded-full px-3',
  'md:h-20 md:flex-col md:gap-[3px] md:rounded-sm md:border md:bg-element md:px-0',
].join(' ')

// 선택 글로우 (Figma 그림자1 = primary 60% blur 4px). 칩·카드 공통
const SELECTED_GLOW = 'drop-shadow-[0px_0px_4px_rgba(188,114,244,0.6)]'

const SELECTED_STYLES = cn(
  'bg-primary-400 text-white md:border-primary-500',
  SELECTED_GLOW,
)
const UNSELECTED_STYLES = 'bg-gray-200 text-gray-400 md:border-transparent'

interface MajorCardProps {
  major: MajorOption
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
      className={cn(CARD_BASE, selected ? SELECTED_STYLES : UNSELECTED_STYLES)}
    >
      {/* 체크는 칩에만, 전공 아이콘은 카드에만 있다 */}
      {selected && <CheckIcon className="size-4 md:hidden" />}
      <Icon
        className={cn(
          'hidden size-8 md:block',
          selected ? 'text-primary-500' : 'text-gray-300',
        )}
      />
      {major.label}
    </button>
  )
})

interface MajorSelectorProps {
  /** 서버에서 받은 전공 선택지 */
  majors: MajorOption[]
  /** 선택된 전공 id 목록 */
  selected: string[]
  /** 전공 토글 콜백 */
  onToggle: (id: string) => void
}

/** 전공 선택 — 패널 안 칩(모바일)·4열 카드(md 이상) 다중선택(최대 MAX_MAJORS) + n/최대 카운터. */
export function MajorSelector({
  majors,
  selected,
  onToggle,
}: MajorSelectorProps) {
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
      <div className="rounded-md border border-element bg-container px-8 py-6">
        <div className="flex flex-wrap gap-2 md:grid md:grid-cols-4 md:gap-4">
          {majors.map((major) => (
            <MajorCard
              key={major.id}
              major={major}
              selected={selected.includes(major.id)}
              onToggle={onToggle}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
