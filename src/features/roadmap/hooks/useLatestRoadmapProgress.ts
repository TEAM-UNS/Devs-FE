import { useQuery } from '@tanstack/react-query'
import { roadmapQueries } from '../api/roadmapQueries'
import { latestRoadmap } from '../utils/roadmapList'

/**
 * 사이드바 진행도 — 가장 최근에 만든 로드맵의 학습률
 * 목록에는 학습률이 없어 그 로드맵의 상세를 한 번 더 받는다. 상세 화면과 같은 캐시라 항목을 체크하면 같이 바뀐다
 * 로드맵이 없거나 아직 만드는 중이면 0
 *
 * @param enabled 로그인 전에는 부르지 않는다 — 401만 돌아와 에러 토스트가 뜬다
 */
export function useLatestRoadmapProgress(enabled: boolean): number {
  const list = useQuery({ ...roadmapQueries.list(), enabled })
  const latest = list.data ? latestRoadmap(list.data) : undefined
  const detail = useQuery({
    ...roadmapQueries.detail(latest?.roadmapId ?? 0),
    enabled: enabled && latest?.status === 'completed',
  })

  return detail.data?.learningRate ?? 0
}
