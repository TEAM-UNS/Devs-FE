import { useMediaQuery } from '@/shared/hooks/useMediaQuery'
import type { Retrospect } from '../../types'
import { splitIntoRows } from '../../utils/board'
import { RetrospectCard } from '../RetrospectCard'
import { RetrospectRow } from '../RetrospectRow'

// Figma 2079:11912 — 줄마다 오른쪽·왼쪽·오른쪽 순으로 흐르고, 출발 위치를 어긋나게 둔다
const ROW_MOTION = [
  { direction: 'right', offset: 0 },
  { direction: 'left', offset: 0.35 },
  { direction: 'right', offset: 0.7 },
] as const

interface RetrospectFlowProps {
  readonly retrospects: readonly Retrospect[]
  readonly onOpen: (retrospect: Retrospect) => void
}

/**
 * 게시판 회고 목록 — 패드·PC는 세 줄로 흐르고(Figma 2284:11116 · 2342:21624), 모바일은 한 줄로 쌓는다(2342:21927)
 * CSS로 둘 다 그려 숨기면 흐르는 줄의 원본 카드와 세로 목록 카드가 같이 남아 같은 회고가 두 번 읽혀서, 폭을 보고 한쪽만 그린다
 */
export function RetrospectFlow({ retrospects, onOpen }: RetrospectFlowProps) {
  const flowing = useMediaQuery('(min-width: 768px)')

  if (!flowing) {
    return (
      <ul className="mt-12 flex flex-col gap-6 px-(--page-px)">
        {retrospects.map((retrospect) => (
          <li key={retrospect.retrospectId}>
            <RetrospectCard
              retrospect={retrospect}
              onOpen={() => onOpen(retrospect)}
              className="w-full"
            />
          </li>
        ))}
      </ul>
    )
  }

  return (
    <div className="mt-12 flex flex-col gap-16">
      {splitIntoRows(retrospects).map((row, index) => (
        <RetrospectRow
          key={index}
          retrospects={row}
          direction={ROW_MOTION[index].direction}
          offset={ROW_MOTION[index].offset}
          onOpen={onOpen}
        />
      ))}
    </div>
  )
}
