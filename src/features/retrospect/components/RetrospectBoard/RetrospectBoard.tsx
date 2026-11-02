import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import boardBackground from '@/assets/retrospect/board-bg.webp'
import { buttonClassName } from '@/shared/components/Button'
import { ROUTES } from '@/shared/constants'
import { retrospectQueries } from '../../api/retrospectQueries'
import { splitIntoRows } from '../../utils/board'
import { RetrospectDetailModal } from '../RetrospectDetailModal'
import { RetrospectRow } from '../RetrospectRow'

// Figma 2079:11912 — 줄마다 오른쪽·왼쪽·오른쪽 순으로 흐르고, 출발 위치를 어긋나게 둔다
const ROW_MOTION = [
  { direction: 'right', offset: 0 },
  { direction: 'left', offset: 0.35 },
  { direction: 'right', offset: 0.7 },
] as const

/** 주간 익명 회고 게시판 — 이번 주 회고가 세 줄로 흐르고, 누르면 상세 모달 */
export function RetrospectBoard() {
  const retrospects = useQuery(retrospectQueries.list())
  /* 상세 모달로 연 회고의 id. 객체 대신 id를 들고 캐시에서 찾아야
     모달 안에서 누른 좋아요가 바로 반영된다 */
  const [openedId, setOpenedId] = useState<number | null>(null)
  const list = retrospects.data ?? []
  const rows = splitIntoRows(list)
  const opened = list.find(({ retrospectId }) => retrospectId === openedId)

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
        <header className="flex shrink-0 items-end justify-between px-12 pt-[58px]">
          <div className="flex flex-col gap-1">
            <h2 className="text-h1 text-white">주간 익명 회고 게시판</h2>
            <p className="text-body-md text-gray-400">
              오늘의 로드맵을 마치고 작성된 러너들의 익명 회고입니다.
              (월요일마다 초기화)
            </p>
          </div>
          <Link to={ROUTES.roadmap} className={buttonClassName()}>
            내 로드맵 확인
          </Link>
        </header>

        {/* TODO: 빈 화면은 디자인에 없다. 임시 문구
            로딩 중·실패는 아무것도 그리지 않는다(실패는 공통 에러 토스트) */}
        {retrospects.isSuccess && list.length === 0 && (
          <p className="m-auto text-body-lg text-gray-400">
            이번 주 회고가 아직 없어요
          </p>
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
              />
            ))}
          </div>
        )}
      </div>

      {opened && (
        <RetrospectDetailModal
          retrospect={opened}
          onClose={() => setOpenedId(null)}
        />
      )}
    </div>
  )
}
