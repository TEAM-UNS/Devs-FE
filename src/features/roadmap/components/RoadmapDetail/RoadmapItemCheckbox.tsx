import { Checkbox } from '@/shared/components/Checkbox'
import { useCheckRoadmapItem } from '../../hooks/useRoadmapMutations'
import type { RoadmapItem } from '../../types'

interface RoadmapItemCheckboxProps {
  readonly item: RoadmapItem
  /** 회고까지 마친 날은 서버가 체크를 막는다 */
  readonly readOnly: boolean
}

/** 학습 항목 하나. 보내는 동안은 그 항목만 잠그고, 응답이 오면 캐시 값으로 바뀐다 */
export function RoadmapItemCheckbox({
  item,
  readOnly,
}: RoadmapItemCheckboxProps) {
  const check = useCheckRoadmapItem()

  return (
    // Checkbox의 비활성 글자색은 회색이라 Figma(완료한 날도 흰 제목)에 맞게 덮어쓴다
    <Checkbox
      checked={item.done}
      disabled={readOnly || check.isPending}
      onChange={(event) =>
        check.mutate({ itemId: item.itemId, done: event.currentTarget.checked })
      }
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
