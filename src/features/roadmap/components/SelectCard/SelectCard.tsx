import type { ComponentType, SVGProps } from 'react'
import { cn } from '@/shared/utils/cn'

interface SelectCardProps {
  readonly title: string
  readonly description?: string
  readonly Icon?: ComponentType<SVGProps<SVGSVGElement>>
  readonly selected: boolean
  readonly onClick: () => void
}

/* Figma 셀렉트카드(408:2476) — 기업 스택 비교의 기업 카드와 같은 모양
   Figma 테두리는 안쪽에 그려져 크기에 안 들어가서 border 대신 ring-inset을 쓴다 */
const BASE =
  'flex w-full flex-col gap-4 rounded-sm p-5 text-left ring-1 ring-inset focus-visible:outline-2 focus-visible:outline-primary-500'
const SELECTED =
  'bg-canvas bg-[linear-gradient(rgb(170_94_241/0.15),rgb(170_94_241/0.15))] ring-primary-400 drop-shadow-[0_0_4px_rgba(188,114,244,0.6)]'
const UNSELECTED = 'bg-container ring-element'

/** 직무·스택 선택 카드. 설명은 한 줄까지만 보여준다 */
export function SelectCard({
  title,
  description,
  Icon,
  selected,
  onClick,
}: SelectCardProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cn(BASE, selected ? SELECTED : UNSELECTED)}
    >
      <span className="flex w-full items-center gap-3">
        {Icon && <Icon className="size-8 shrink-0 text-gray-300" />}
        <span className="min-w-0 flex-1 truncate text-h3 text-white">
          {title}
        </span>
      </span>
      {description && (
        <span className="w-full truncate text-body-sm text-gray-400">
          {description}
        </span>
      )}
    </button>
  )
}
