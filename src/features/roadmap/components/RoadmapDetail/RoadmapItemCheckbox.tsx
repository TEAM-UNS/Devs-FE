import { Checkbox } from '@/shared/components/Checkbox'
import { useCheckRoadmapItem } from '../../hooks/useRoadmapMutations'
import type { RoadmapItem } from '../../types'

interface RoadmapItemCheckboxProps {
  readonly item: RoadmapItem
  /** 회고까지 마친 날은 서버가 체크를 막는다 */
  readonly readOnly: boolean
  /** 지난 날은 회색으로 접는다. 오늘은 회고를 마쳐도 Figma(2078:9058)처럼 보라 체크로 둔다 */
  readonly dimmed: boolean
}

/** 학습 항목 하나. 보내는 동안은 그 항목만 잠그고, 응답이 오면 캐시 값으로 바뀐다 */
export function RoadmapItemCheckbox({
  item,
  readOnly,
  dimmed,
}: RoadmapItemCheckboxProps) {
  const check = useCheckRoadmapItem()

  return (
    // Checkbox의 비활성 글자색은 회색이라 Figma(완료한 날도 흰 제목)에 맞게 덮어쓴다
    <Checkbox
      checked={item.done}
      disabled={(readOnly && dimmed) || check.isPending}
      // 바꿀 수 없지만 보라로 남기는 경우 — 눌러도 보내지 않고 읽기 전용으로 알린다
      readOnly={readOnly}
      aria-disabled={readOnly || undefined}
      className={readOnly ? 'cursor-default' : undefined}
      onChange={(event) => {
        if (readOnly) return
        check.mutate({ itemId: item.itemId, done: event.currentTarget.checked })
      }}
      label={<span className="text-white">{item.title}</span>}
      description={
        item.description && (
          <span className="whitespace-pre-line text-gray-300">
            {item.description}
          </span>
        )
      }
    />
  )
}
