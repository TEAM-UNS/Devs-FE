import { queryOptions } from '@tanstack/react-query'
import { isGenerating } from '../utils/roadmapStatus'
import { fetchMyRoadmap, fetchRoadmapStatus } from './requests'

/** 만드는 동안 진행률을 다시 묻는 간격 */
const STATUS_POLL_INTERVAL = 3000

export const roadmapQueries = {
  all: () => ['roadmap'] as const,

  mine: () =>
    queryOptions({
      queryKey: [...roadmapQueries.all(), 'mine'] as const,
      queryFn: fetchMyRoadmap,
    }),

  status: (roadmapId: number) =>
    queryOptions({
      queryKey: [...roadmapQueries.all(), 'status', roadmapId] as const,
      queryFn: () => fetchRoadmapStatus(roadmapId),
      /* 끝났거나 조회가 실패하면 멈춘다. 실패한 채로 계속 물으면 3초마다 에러 토스트가 뜬다 */
      refetchInterval: ({ state }) =>
        state.status !== 'error' &&
        (!state.data || isGenerating(state.data.status))
          ? STATUS_POLL_INTERVAL
          : false,
    }),
}
