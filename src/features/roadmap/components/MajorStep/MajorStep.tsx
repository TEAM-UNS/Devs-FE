import { useState } from 'react'
import { majorLabel } from '@/shared/api'
import { majorIcon } from '@/shared/components/icons'
import { MAJOR_DESCRIPTIONS } from '../../constants/create'
import type { RoadmapMajor } from '../../types'
import { SearchField } from '../SearchField'
import { SelectCard } from '../SelectCard'
import { StepLayout } from '../StepLayout'

interface MajorStepProps {
  readonly majors: readonly RoadmapMajor[]
  readonly selectedId: number | null
  readonly onSelect: (id: number) => void
  readonly onNext: () => void
}

/** 1단계 목표 직무 — 하나만 고른다. Figma 520:2428(고름)·559:3921(고르기 전) */
export function MajorStep({
  majors,
  selectedId,
  onSelect,
  onNext,
}: MajorStepProps) {
  const [keyword, setKeyword] = useState('')
  const query = keyword.trim().toLowerCase()
  const visible = majors.filter(({ major }) =>
    majorLabel(major).toLowerCase().includes(query),
  )

  return (
    <StepLayout
      step={1}
      title="목표 직무 설정"
      description="목표로 하는 직무를 하나를 선택해주세요."
      nextLabel={
        selectedId === null ? '직무를 선택해 주세요' : '직무 선택 완료'
      }
      nextDisabled={selectedId === null}
      onNext={onNext}
    >
      <SearchField
        label="직무 검색"
        placeholder="원하는 전공을 검색하세요"
        value={keyword}
        onChange={setKeyword}
      />
      <ul className="grid min-h-0 w-full flex-1 grid-cols-3 content-start gap-8 overflow-y-auto pt-2 pb-24">
        {visible.map(({ id, major }) => (
          <li key={id}>
            <SelectCard
              title={majorLabel(major)}
              description={MAJOR_DESCRIPTIONS[major]}
              Icon={majorIcon(major)}
              selected={id === selectedId}
              onClick={() => onSelect(id)}
            />
          </li>
        ))}
      </ul>
    </StepLayout>
  )
}
