import { useMutation, useQueryClient } from '@tanstack/react-query'
import { roadmapQueries } from '../api/roadmapQueries'
import {
  checkRoadmapItem,
  completeRoadmapDay,
  createRoadmap,
} from '../api/requests'
import type { RoadmapCreateRequest } from '../types'
import { applyItemCheck } from '../utils/applyItemCheck'

/* 에러 토스트는 세 mutation 모두 공통 MutationCache가 띄운다 */

/** 로드맵 생성 요청. 끝나면 내 로드맵을 다시 받아 '만드는 중'을 보여준다 */
export function useCreateRoadmap() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: RoadmapCreateRequest) => createRoadmap(body),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: roadmapQueries.mine().queryKey,
      }),
  })
}

/**
 * 항목 체크. 응답이 올 때까지 기다렸다가 캐시에 반영한다
 * 응답에 그날의 완료 여부와 학습률이 같이 와서 다시 조회하지 않는다
 *
 * 체크박스마다 mutation이 따로라, 여러 항목을 연달아 누르면 요청이 동시에 나간다
 * 응답 순서가 뒤바뀌면 먼저 보낸 요청의 학습률이 나중 값을 덮으므로 같은 scope로 하나씩 보낸다
 */
export function useCheckRoadmapItem() {
  const queryClient = useQueryClient()
  const { queryKey } = roadmapQueries.mine()

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

/** 하루 완료 + 회고. 완료하면 그날이 잠기므로 내 로드맵을 다시 받는다 */
export function useCompleteRoadmapDay() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      dayNo,
      retrospect,
    }: {
      dayNo: number
      retrospect: string
    }) => completeRoadmapDay(dayNo, retrospect),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: roadmapQueries.mine().queryKey,
      }),
  })
}
