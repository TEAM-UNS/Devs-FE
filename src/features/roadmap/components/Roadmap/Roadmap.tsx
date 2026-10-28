import { useQuery } from '@tanstack/react-query'
import { Navigate } from 'react-router-dom'
import { ROUTES } from '@/shared/constants'
import { roadmapQueries } from '../../api/roadmapQueries'
import { RoadmapDetail } from '../RoadmapDetail'
import { RoadmapPending } from '../RoadmapPending'

/** 내 로드맵 화면 — 없으면 생성 흐름, 만드는 중·실패면 진행 화면, 다 만들어졌으면 상세 */
export function Roadmap() {
  const roadmap = useQuery(roadmapQueries.mine())

  // TODO: 로딩 화면은 스켈레톤(#65) 디자인 확인 후. 실패는 공통 에러 토스트
  if (roadmap.isPending || roadmap.isError) return null

  if (roadmap.data === null) {
    return <Navigate to={ROUTES.roadmapNew} replace />
  }

  if (roadmap.data.status !== 'completed') {
    return <RoadmapPending roadmapId={roadmap.data.roadmapId} />
  }

  return <RoadmapDetail roadmap={roadmap.data} />
}
