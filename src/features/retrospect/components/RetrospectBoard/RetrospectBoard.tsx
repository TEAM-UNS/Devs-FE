import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { buttonClassName } from '@/shared/components/Button'
import { ROUTES } from '@/shared/constants'
import { retrospectQueries } from '../../api/retrospectQueries'
import { RetrospectWall } from '../RetrospectWall'

/** 주간 익명 회고 게시판 — 이번 주 회고가 세 줄로 흐르고, 누르면 상세 모달 */
export function RetrospectBoard() {
  const retrospects = useQuery(retrospectQueries.list())

  return (
    <RetrospectWall
      header={
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
      }
      retrospects={retrospects.data ?? []}
      loaded={retrospects.isSuccess}
      emptyText="이번 주 회고가 아직 없어요"
    />
  )
}
