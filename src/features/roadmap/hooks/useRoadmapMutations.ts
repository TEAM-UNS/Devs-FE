import { useMutation, useQueryClient } from '@tanstack/react-query'
import { RETROSPECT_QUERY_KEY } from '@/shared/api'
import { trackEvent } from '@/shared/analytics'
import { roadmapQueries } from '../api/roadmapQueries'
import {
  checkRoadmapItem,
  completeRoadmapDay,
  createRoadmap,
  deleteRoadmap,
} from '../api/requests'
import type { RoadmapCreateRequest } from '../types'
import { applyItemCheck } from '../utils/applyItemCheck'

/* 에러 토스트는 모든 mutation에서 공통 MutationCache가 띄운다 */

/** 로드맵 생성 요청. 끝나면 목록을 다시 받는다. 새 로드맵의 '만드는 중' 화면은 응답의 id로 연다 */
export function useCreateRoadmap() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: RoadmapCreateRequest) => createRoadmap(body),
    onSuccess: (_, body) => {
      trackEvent('Roadmap Created', {
        target_weeks: body.targetWeeks,
        skill_count: body.skillIds.length,
      })
      return queryClient.invalidateQueries({
        queryKey: roadmapQueries.list().queryKey,
      })
    },
  })
}

/**
 * 항목 체크. 응답이 올 때까지 기다렸다가 캐시에 반영한다
 * 응답에 그날의 완료 여부와 학습률이 같이 와서 다시 조회하지 않는다
 *
 * 체크박스마다 mutation이 따로라, 여러 항목을 연달아 누르면 요청이 동시에 나간다
 * 응답 순서가 뒤바뀌면 먼저 보낸 요청의 학습률이 나중 값을 덮으므로 같은 scope로 하나씩 보낸다
 */
export function useCheckRoadmapItem(roadmapId: number) {
  const queryClient = useQueryClient()
  const { queryKey } = roadmapQueries.detail(roadmapId)

  return useMutation({
    scope: { id: 'roadmap/item-check' },
    mutationFn: ({ itemId, done }: { itemId: number; done: boolean }) =>
      checkRoadmapItem(itemId, done),
    onSuccess: (response) =>
      queryClient.setQueryData(
        queryKey,
        (current) => current && applyItemCheck(current, response),
      ),
  })
}

/**
 * 하루 완료 + 회고. 완료하면 그날이 잠기므로 내 로드맵을 다시 받는다
 * 새 회고가 익명 게시판·내 회고 목록에 바로 보이도록 회고 쿼리도 함께 무효화한다
 */
export function useCompleteRoadmapDay(roadmapId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      dayNo,
      retrospect,
    }: {
      dayNo: number
      retrospect: string
    }) => completeRoadmapDay(roadmapId, dayNo, retrospect),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({
          queryKey: roadmapQueries.detail(roadmapId).queryKey,
        }),
        queryClient.invalidateQueries({ queryKey: RETROSPECT_QUERY_KEY }),
      ]),
  })
}

/**
 * 로드맵 삭제. 끝나면 목록을 다시 받고, 지운 로드맵의 상세 캐시는 버린다
 * 그 로드맵에서 쓴 회고가 게시판·내 회고에서 빠질 수 있어 회고 쿼리도 무효화한다
 */
export function useDeleteRoadmap() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (roadmapId: number) => deleteRoadmap(roadmapId),
    onSuccess: (_, roadmapId) => {
      queryClient.removeQueries({
        queryKey: roadmapQueries.detail(roadmapId).queryKey,
      })
      return Promise.all([
        queryClient.invalidateQueries({
          queryKey: roadmapQueries.list().queryKey,
        }),
        queryClient.invalidateQueries({ queryKey: RETROSPECT_QUERY_KEY }),
      ])
    },
  })
}
