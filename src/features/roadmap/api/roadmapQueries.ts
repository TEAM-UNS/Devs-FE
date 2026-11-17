import { queryOptions } from '@tanstack/react-query'
import { isGenerating } from '../utils/roadmapStatus'
import { fetchMyRoadmaps, fetchRoadmap, fetchRoadmapStatus } from './requests'

/** 만드는 동안 진행률을 다시 묻는 간격 */
const STATUS_POLL_INTERVAL = 3000

export const roadmapQueries = {
  all: () => ['roadmap'] as const,

  /** 내 로드맵 목록 — 여러 개를 가질 수 있다 */
  list: () =>
    queryOptions({
      queryKey: [...roadmapQueries.all(), 'list'] as const,
      queryFn: fetchMyRoadmaps,
    }),

  /** 로드맵 하나의 학습률·Day별 항목 */
  detail: (roadmapId: number) =>
    queryOptions({
      queryKey: [...roadmapQueries.all(), 'detail', roadmapId] as const,
      queryFn: () => fetchRoadmap(roadmapId),
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
