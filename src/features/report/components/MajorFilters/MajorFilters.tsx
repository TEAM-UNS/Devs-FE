import { Button } from '@/shared/components/Button'
import type { MajorOption } from '../../types'

interface MajorFiltersProps {
  /** 칩 목록. 맨 앞이 '전체'(`value: null`)다 */
  options: readonly MajorOption[]
  selected: number | null
  onSelect: (value: number | null) => void
}

/* 디자인은 Chip이 아니라 **button 컴포넌트**를 쓴다(Figma 335:2834 = `button` 인스턴스,
   `사이즈=small` h32 · 좌우 패딩 16). 선택은 primary, 비선택은 outline이다.
   두 가지만 인스턴스에서 덮어썼다.
   - radius: 컴포넌트 기본은 6인데 이 화면 인스턴스는 pill(999999)
   - 라벨 굵기: 컴포넌트 기본은 SemiBold인데 이 화면은 Regular */
const SHAPE = 'rounded-full font-normal'

/**
 * 전공 필터 — '전체'와 사용자가 고른 전공 중 하나만 선택된다(라디오 성격).
 *
 * `role="radiogroup"`이 아니라 `aria-pressed` 버튼으로 두는 이유: 라디오로 바꾸면
 * 화살표 키 이동 같은 규약까지 따라와야 하는데 지금 상호작용은 클릭 하나뿐이다.
 *
 * @param options 칩 목록
 * @param selected 현재 선택된 전공 id (`null`이면 전체)
 * @param onSelect 클릭 시 호출
 */
export function MajorFilters({
  options,
  selected,
  onSelect,
}: MajorFiltersProps) {
  return (
    <div className="flex items-center gap-1.5">
      {options.map(({ value, label }) => (
        <Button
          key={value ?? 'all'}
          size="sm"
          variant={value === selected ? 'primary' : 'outline'}
          aria-pressed={value === selected}
          onClick={() => onSelect(value)}
          className={SHAPE}
        >
          {label}
        </Button>
      ))}
    </div>
  )
}
