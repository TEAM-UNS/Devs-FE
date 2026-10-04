import { memo, useCallback } from 'react'
import { Chip } from '@/shared/components/Chip'
import { ArrowIcon, CheckIcon } from '@/shared/components/icons'
import { cn } from '@/shared/utils/cn'
import type { TechStackGroup, TechTag } from './techStacks'

// 아래 상수는 모듈 스코프 — 렌더마다 새로 만들지 않는다 (react-perf).

// 선택된 칩 앞 체크 (Figma Filter Chip 타입=check). 비선택 칩엔 아이콘이 없다.
const CHECK_ICON = <CheckIcon className="size-full" />

const HEADER_STYLES = [
  'flex w-fit items-center gap-1 rounded-sm',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
].join(' ')

interface TechChipProps {
  tag: TechTag
  selected: boolean
  onToggle: (tagId: string) => void
}

const TechChip = memo(function TechChip({
  tag,
  selected,
  onToggle,
}: TechChipProps) {
  const handleClick = useCallback(() => onToggle(tag.id), [onToggle, tag.id])

  return (
    <Chip
      selected={selected}
      icon={selected ? CHECK_ICON : undefined}
      onClick={handleClick}
    >
      {tag.label}
    </Chip>
  )
})

interface TechStackSectionProps {
  group: TechStackGroup
  /** 이 그룹에서 선택된 태그 id 목록 */
  selected: string[]
  /** 펼침 여부 */
  open: boolean
  /** 헤더 클릭 콜백 */
  onToggleOpen: (majorId: string) => void
  /** 칩 클릭 콜백 */
  onToggleTag: (majorId: string, tagId: string) => void
}

/** 기술 스택 그룹 하나 — 전공 이름 헤더(접기/펼치기) + Filter Chip 목록. */
export const TechStackSection = memo(function TechStackSection({
  group,
  selected,
  open,
  onToggleOpen,
  onToggleTag,
}: TechStackSectionProps) {
  const { majorId } = group

  const handleToggleOpen = useCallback(
    () => onToggleOpen(majorId),
    [onToggleOpen, majorId],
  )
  const handleToggleTag = useCallback(
    (tagId: string) => onToggleTag(majorId, tagId),
    [onToggleTag, majorId],
  )

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        aria-expanded={open}
        onClick={handleToggleOpen}
        className={HEADER_STYLES}
      >
        <span className="text-body-md font-semibold text-white">
          {group.label}
          {selected.length > 0 && (
            <span className="text-primary-500">
              {` (${selected.length}개 선택됨)`}
            </span>
          )}
        </span>
        {/* 디자인 기준: 펼침=아래(⌄), 접힘=위(⌃). 흔한 관례와 반대다. */}
        <ArrowIcon
          className={cn(
            'size-6 text-gray-200',
            open ? '-rotate-90' : 'rotate-90',
          )}
        />
      </button>

      {open && (
        <div className="flex flex-wrap gap-3">
          {group.tags.map((tag) => (
            <TechChip
              key={tag.id}
              tag={tag}
              selected={selected.includes(tag.id)}
              onToggle={handleToggleTag}
            />
          ))}
        </div>
      )}
    </div>
  )
})
