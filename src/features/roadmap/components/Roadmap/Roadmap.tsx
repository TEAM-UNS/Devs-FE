import { useQuery } from '@tanstack/react-query'
import { roadmapQueries } from '../../api/roadmapQueries'
import { RoadmapDetail, RoadmapDetailSkeleton } from '../RoadmapDetail'
import { RoadmapPending } from '../RoadmapPending'

interface RoadmapProps {
  readonly roadmapId: number
}

/** 로드맵 하나 — 만드는 중·실패면 진행 화면, 다 만들어졌으면 상세 */
export function Roadmap({ roadmapId }: RoadmapProps) {
  const roadmap = useQuery(roadmapQueries.detail(roadmapId))

  if (roadmap.isPending) return <RoadmapDetailSkeleton />
  // 실패는 공통 에러 토스트
  if (roadmap.isError) return null

  if (roadmap.data.status !== 'completed') {
    return <RoadmapPending roadmapId={roadmapId} />
  }

  return <RoadmapDetail roadmap={roadmap.data} />
}
