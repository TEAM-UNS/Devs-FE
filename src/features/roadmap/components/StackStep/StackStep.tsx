import { useState } from 'react'
import { Chip } from '@/shared/components/Chip'
import { SearchField } from '../SearchField'
import { SelectCard } from '../SelectCard'
import { StepLayout } from '../StepLayout'

interface Stack {
  id: number
  name: string
}

interface StackStepProps {
  /** 1단계에서 고른 직무의 스택 */
  readonly stacks: readonly Stack[]
  readonly selectedIds: readonly number[]
  readonly onToggle: (id: number) => void
  readonly onPrevious: () => void
  readonly onNext: () => void
}

/**
 * 2단계 관심 스택 — 여러 개 고른다. Figma 520:5537
 * 서버가 스택 로고·설명을 주지 않아 카드엔 이름만 둔다
 */
export function StackStep({
  stacks,
  selectedIds,
  onToggle,
  onPrevious,
  onNext,
}: StackStepProps) {
  const [keyword, setKeyword] = useState('')
  const query = keyword.trim().toLowerCase()
  const visible = stacks.filter(({ name }) =>
    name.toLowerCase().includes(query),
  )
  const selected = stacks.filter(({ id }) => selectedIds.includes(id))

  return (
    <StepLayout
      step={2}
      title="관심 스택 선택"
      description="희망 기술 스택을 선택하세요. 복수 선택이 가능합니다."
      onPrevious={onPrevious}
      // TODO: 고르기 전 문구는 디자인에 없다. 1단계 '직무를 선택해 주세요'에 맞춘 임시 문구
      nextLabel={
        selected.length === 0
          ? '스택을 선택해 주세요'
          : `${selected.length}개 스택 선택 완료`
      }
      nextDisabled={selected.length === 0}
      onNext={onNext}
    >
      <SearchField
        label="스택 검색"
        placeholder="React, Java 등 스택을 검색하세요."
        value={keyword}
        onChange={setKeyword}
      >
        {selected.length > 0 && (
          <ul className="flex flex-wrap gap-2" aria-label="선택한 스택">
            {selected.map(({ id, name }) => (
              <li key={id}>
                <Chip
                  size="small"
                  onRemove={() => onToggle(id)}
                  removeLabel={`${name} 선택 해제`}
                >
                  {name}
                </Chip>
              </li>
            ))}
          </ul>
        )}
      </SearchField>
      <ul className="grid min-h-0 w-full flex-1 grid-cols-3 content-start gap-8 overflow-y-auto pt-2 pb-24">
        {visible.map(({ id, name }) => (
          <li key={id}>
            <SelectCard
              title={name}
              selected={selectedIds.includes(id)}
              onClick={() => onToggle(id)}
            />
          </li>
        ))}
      </ul>
    </StepLayout>
  )
}
