import { useState, type ReactNode } from 'react'
import boardBackground from '@/assets/retrospect/board-bg.webp'
import type { Retrospect } from '../../types'
import { splitIntoRows } from '../../utils/board'
import { RetrospectDetailModal } from '../RetrospectDetailModal'
import { RetrospectRow } from '../RetrospectRow'

// Figma 2079:11912 — 줄마다 오른쪽·왼쪽·오른쪽 순으로 흐르고, 출발 위치를 어긋나게 둔다
const ROW_MOTION = [
  { direction: 'right', offset: 0 },
  { direction: 'left', offset: 0.35 },
  { direction: 'right', offset: 0.7 },
] as const

interface RetrospectWallProps {
  /** 배경 위 머리말 — 제목·설명·버튼 */
  readonly header: ReactNode
  readonly retrospects: readonly Retrospect[]
  /** 받아 온 뒤에만 빈 안내를 띄운다. 로딩 중·실패는 아무것도 그리지 않는다(실패는 공통 에러 토스트) */
  readonly loaded: boolean
  readonly emptyText: string
  /** 내 회고 — 제목을 '내 로드맵'으로 부르고 좋아요는 개수만 보여준다 */
  readonly mine?: boolean
}

/**
 * 회고가 세 줄로 흐르는 배경 화면 + 누르면 상세 모달
 * 익명 회고 게시판과 내 회고 몰아보기가 같이 쓴다. 두 화면은 머리말과 데이터만 다르다
 */
export function RetrospectWall({
  header,
  retrospects,
  loaded,
  emptyText,
  mine = false,
}: RetrospectWallProps) {
  /* 상세 모달로 연 회고의 id. 객체 대신 id를 들고 목록에서 찾아야
     모달 안에서 누른 좋아요가 바로 반영된다 */
  const [openedId, setOpenedId] = useState<number | null>(null)
  const rows = splitIntoRows(retrospects)
  const opened = retrospects.find(
    ({ retrospectId }) => retrospectId === openedId,
  )

  return (
    /* 배경이 화면 끝까지 깔리게 main의 안쪽 여백(p-10)만큼 밖으로 넓힌다
       높이는 최소값만 둬서 화면이 낮으면 main이 세로로 스크롤한다. 흐르는 줄이 넘치는 가로만 자른다 */
    <div className="relative -m-10 flex min-h-[calc(100%+5rem)] flex-col overflow-x-clip">
      <img
        src={boardBackground}
        alt=""
        className="pointer-events-none absolute inset-0 size-full object-cover"
      />
      {/* Figma Rectangle 12 — 위쪽을 어둡게 눌러 제목이 배경 구슬에 묻히지 않게 한다 */}
      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-canvas/60 via-canvas/20 via-[25%] to-transparent to-[62%]" />

      <div className="relative flex flex-1 flex-col pb-10">
        {header}

        {/* TODO: 빈 화면은 디자인에 없다. 임시 문구 */}
        {loaded && retrospects.length === 0 && (
          <p className="m-auto text-body-lg text-gray-400">{emptyText}</p>
        )}
        {rows.length > 0 && (
          <div className="mt-[66px] flex flex-col gap-16">
            {rows.map((row, index) => (
              <RetrospectRow
                key={index}
                retrospects={row}
                direction={ROW_MOTION[index].direction}
                offset={ROW_MOTION[index].offset}
                onOpen={({ retrospectId }) => setOpenedId(retrospectId)}
                mine={mine}
              />
            ))}
          </div>
        )}
      </div>

      {opened && (
        <RetrospectDetailModal
          retrospect={opened}
          onClose={() => setOpenedId(null)}
          mine={mine}
        />
      )}
    </div>
  )
}
