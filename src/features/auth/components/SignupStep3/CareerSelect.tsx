import { useCallback } from 'react'
import { Dropdown } from '@/shared/components/Dropdown'
import { cn } from '@/shared/utils/cn'
// 변환표(toPersonalHistory)와 같은 값을 봐야 해서 목록은 utils가 소유한다.
import { CAREER_LEVELS } from '../../utils/careerLevels'

type CareerType = 'none' | 'has'

// 세그먼트 버튼 공통 — 트랙을 균등 분할(flex-1), 선택 시 primary 채움.
const SEGMENT_BASE = [
  'flex h-full flex-1 items-center justify-center rounded-sm px-6',
  'text-body-md whitespace-nowrap',
  'transition-colors duration-fast ease-standard',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
].join(' ')

interface CareerSelectProps {
  /** 선택된 경력 유무 (미선택 시 undefined) */
  careerType?: CareerType
  /** 선택된 연차 value */
  careerLevel?: string
  /** 경력 유무 변경 콜백 */
  onCareerTypeChange: (type: CareerType) => void
  /** 연차 변경 콜백 */
  onCareerLevelChange: (value: string) => void
}

/** 경력 선택 — 유무 세그먼트 토글 + 연차 Dropdown('경력 있음'일 때만 활성). */
export function CareerSelect({
  careerType,
  careerLevel,
  onCareerTypeChange,
  onCareerLevelChange,
}: CareerSelectProps) {
  const selectNone = useCallback(
    () => onCareerTypeChange('none'),
    [onCareerTypeChange],
  )
  const selectHas = useCallback(
    () => onCareerTypeChange('has'),
    [onCareerTypeChange],
  )

  return (
    <div className="flex flex-col gap-3">
      <span className="text-body-md text-white">경력 선택</span>
      <div className="flex items-start gap-3">
        {/* 세그먼트 토글: element 트랙(6px 패딩) + 균등 세그먼트 2개 */}
        <div className="flex h-12 w-60 shrink-0 rounded-sm bg-element p-1.5">
          <button
            type="button"
            aria-pressed={careerType === 'none'}
            onClick={selectNone}
            className={cn(
              SEGMENT_BASE,
              careerType === 'none'
                ? 'bg-primary-500 text-white'
                : 'text-gray-300',
            )}
          >
            경력 없음
          </button>
          <button
            type="button"
            aria-pressed={careerType === 'has'}
            onClick={selectHas}
            className={cn(
              SEGMENT_BASE,
              careerType === 'has'
                ? 'bg-primary-500 text-white'
                : 'text-gray-300',
            )}
          >
            경력 있음
          </button>
        </div>
        <Dropdown
          className="flex-1"
          options={CAREER_LEVELS}
          value={careerLevel ?? ''}
          onChange={onCareerLevelChange}
          placeholder="경력을 선택해주세요"
          disabled={careerType !== 'has'}
        />
      </div>
    </div>
  )
}
