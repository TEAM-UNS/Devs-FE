import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { buttonClassName } from '@/shared/components/Button'
import { ROUTES } from '@/shared/constants'
import { roadmapQueries } from '../../api/roadmapQueries'
import { RoadmapGenerating } from '../RoadmapGenerating'

interface RoadmapPendingProps {
  readonly roadmapId: number
}

const FAILED_FALLBACK = '잠시 후 다시 만들어 주세요.'

/**
 * 아직 다 만들어지지 않은 로드맵. 진행률을 3초마다 묻고, 끝나면 내 로드맵을 다시 받아 상세로 넘어간다
 * 화면을 나갔다 와도 서버 상태로 이어서 보여준다
 */
export function RoadmapPending({ roadmapId }: RoadmapPendingProps) {
  const queryClient = useQueryClient()
  const status = useQuery(roadmapQueries.status(roadmapId))
  const current = status.data?.status

  useEffect(() => {
    if (current === 'completed') {
      void queryClient.invalidateQueries({
        queryKey: roadmapQueries.mine().queryKey,
      })
    }
  }, [current, queryClient])

  if (current === 'failed') {
    // TODO: 실패 화면은 디자인에 없다. 생성 중 화면 틀에 맞춘 임시 문구·버튼
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="flex flex-col items-center gap-1">
            <h2 className="text-h2 text-white">로드맵을 만들지 못했어요</h2>
            <p className="text-body-md text-gray-400">
              {status.data?.errorMessage ?? FAILED_FALLBACK}
            </p>
          </div>
          <Link to={ROUTES.roadmapNew} className={buttonClassName()}>
            다시 만들기
          </Link>
        </div>
      </div>
    )
  }

  return <RoadmapGenerating progress={status.data?.progress ?? 0} />
}
