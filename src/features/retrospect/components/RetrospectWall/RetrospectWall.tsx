import { useState, type ReactNode } from 'react'
import boardBackground from '@/assets/retrospect/board-bg.webp'
import type { Retrospect } from '../../types'
import { RetrospectDetailModal } from '../RetrospectDetailModal'
import { RetrospectFlow } from '../RetrospectFlow'
import { RetrospectTimeline } from '../RetrospectTimeline'

interface RetrospectWallProps {
  /** 배경 위 머리말 — 제목·설명·버튼 */
  readonly header: ReactNode
  readonly retrospects: readonly Retrospect[]
  /** 받아 온 뒤에만 빈 안내를 띄운다. 로딩 중·실패는 아무것도 그리지 않는다(실패는 공통 에러 토스트) */
  readonly loaded: boolean
  readonly emptyText: string
  /** 내 회고 — 흐르는 줄 대신 세로 타임라인, 제목은 '내 로드맵', 좋아요는 개수만 보여준다 */
  readonly mine?: boolean
}

/**
 * 회고 배경 화면 + 누르면 상세 모달. 게시판은 세 줄로 흐르고, 내 회고는 세로 타임라인
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
  const opened = retrospects.find(
    ({ retrospectId }) => retrospectId === openedId,
  )

  return (
    /* 배경이 화면 끝까지 깔리게 main의 안쪽 여백(p-page)만큼 밖으로 넓힌다
       높이는 최소값만 둬서 화면이 낮으면 main이 세로로 스크롤한다. 흐르는 줄이 넘치는 가로만 자른다 */
    <div className="relative -m-page flex min-h-[calc(100%+var(--page-pt)+var(--page-pb))] flex-col overflow-x-clip">
      <img
        src={boardBackground}
        alt=""
        className="pointer-events-none absolute inset-0 size-full object-cover"
      />
      {/* Figma Rectangle 12 — 위쪽을 어둡게 눌러 제목이 배경 구슬에 묻히지 않게 한다 */}
      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-canvas/60 via-canvas/20 via-[25%] to-transparent to-[62%]" />

      {/* 위아래는 페이지 여백 그대로. 흐르는 줄이 화면 끝까지 지나가야 해서 좌우 여백은 머리말·세로 목록만 갖는다
          머리말은 다른 화면처럼 1380 안에서 가운데 (Figma 2284:11685) */}
      <div className="relative flex flex-1 flex-col pt-(--page-pt) pb-(--page-pb)">
        <div className="px-(--page-px)">
          <div className="mx-auto w-full max-w-[1380px]">{header}</div>
        </div>

        {/* TODO: 빈 화면은 디자인에 없다. 임시 문구 */}
        {loaded && retrospects.length === 0 && (
          <p className="m-auto text-body-lg text-gray-400">{emptyText}</p>
        )}
        {mine && retrospects.length > 0 && (
          <RetrospectTimeline
            retrospects={retrospects}
            onOpen={({ retrospectId }) => setOpenedId(retrospectId)}
          />
        )}
        {!mine && retrospects.length > 0 && (
          <RetrospectFlow
            retrospects={retrospects}
            onOpen={({ retrospectId }) => setOpenedId(retrospectId)}
          />
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
