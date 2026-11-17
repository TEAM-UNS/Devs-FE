import { Link, Navigate, useParams } from 'react-router-dom'
import { Roadmap } from '@/features/roadmap'
import { ArrowIcon } from '@/shared/components/icons'
import { PageTitle } from '@/shared/components/PageTitle'
import { ROUTES } from '@/shared/constants'

/**
 * 로드맵 하나 — 학습률·Day별 학습 항목. 주소의 id가 숫자가 아니면 목록으로 보낸다
 *
 * @returns 로드맵 상세(만드는 중이면 진행) 화면
 */
export default function RoadmapDetailPage() {
  const { roadmapId } = useParams()
  const id = Number(roadmapId)

  if (!Number.isInteger(id) || id <= 0) {
    return <Navigate to={ROUTES.roadmap} replace />
  }

  return (
    <>
      <PageTitle name="로드맵" />
      {/* 다른 화면처럼 페이지 여백 안에서 최대 1380 (Figma 1396:6908) */}
      <div className="mx-auto flex h-full w-full max-w-[1380px] flex-col gap-6">
        {/* 로드맵이 여러 개라 목록으로 돌아갈 길을 둔다. 모양은 만들기 화면의 '이전'과 같다 (디자인 없음) */}
        <Link
          to={ROUTES.roadmap}
          className="flex shrink-0 items-center gap-1 self-start text-body-md font-semibold text-gray-300 hover:text-gray-400 focus-visible:rounded-xs focus-visible:outline-2 focus-visible:outline-primary-500"
        >
          <ArrowIcon className="size-6" />내 로드맵
        </Link>
        <div className="min-h-0 flex-1">
          {/* 다른 로드맵으로 옮겨 가면 상태(열린 모달 등)를 새로 시작한다 */}
          <Roadmap key={id} roadmapId={id} />
        </div>
      </div>
    </>
  )
}
