import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  subscriptionQueries,
  updateReportSubscription,
} from '../api/subscription'

/**
 * 구독 설정 저장. 누르자마자 바뀌어 보이게 캐시를 먼저 고치고, 실패하면 되돌린다
 * 에러 토스트는 공통 MutationCache가 띄운다
 *
 * @returns 저장 mutation
 */
export function useUpdateReportSubscription() {
  const queryClient = useQueryClient()
  const { queryKey } = subscriptionQueries.detail()

  return useMutation({
    mutationFn: updateReportSubscription,
    onMutate: async (next) => {
      // 진행 중인 조회가 늦게 도착해 방금 바꾼 값을 덮지 않게 멈춘다
      await queryClient.cancelQueries({ queryKey })
      const previous = queryClient.getQueryData(queryKey)
      queryClient.setQueryData(queryKey, next)
      return { previous }
    },
    onError: (_error, _next, context) => {
      queryClient.setQueryData(queryKey, context?.previous)
    },
    // 성공·실패 모두 서버 값으로 맞춘다
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  })
}
