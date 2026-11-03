import { ArrowIcon } from '@/shared/components/icons'
import { ROUTES } from '@/shared/constants'
import { useGoBack } from '@/shared/hooks/useGoBack'
import { useMyRetrospects } from '../../hooks/useMyRetrospects'
import { RetrospectWall } from '../RetrospectWall'

/**
 * 내 회고 몰아보기 — Figma 2217:8656
 * 익명 게시판과 같은 배경·카드로, 내가 쓴 회고를 월별 세로 타임라인에 보여준다. 제목은 '내 로드맵 - DayN', 좋아요는 개수만 보여준다
 */
export function MyRetrospects() {
  const retrospects = useMyRetrospects()
  const goBack = useGoBack(ROUTES.myPage)

  return (
    <RetrospectWall
      header={
        <header className="flex shrink-0 flex-col gap-3 px-12 pt-12">
          <button
            type="button"
            onClick={goBack}
            className="flex items-center gap-1.5 self-start text-body-md text-gray-400"
          >
            <ArrowIcon className="size-6" />
            돌아가기
          </button>
          <div className="flex flex-col gap-1">
            <h2 className="text-h1 text-white">내 회고 몰아보기</h2>
            <p className="text-body-md text-gray-400">
              그동안 작성한 자신의 후기들을 모아둔 공간입니다
            </p>
          </div>
        </header>
      }
      retrospects={retrospects.data ?? []}
      loaded={retrospects.isSuccess}
      emptyText="아직 작성한 회고가 없어요"
      mine
    />
  )
}
