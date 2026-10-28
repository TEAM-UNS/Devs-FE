import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  type ReportSubscription,
  subscriptionQueries,
  updateReportSubscription,
} from '../api/subscription'

/** 지금 캐시 값을 받아 바꾼 값을 돌려준다 */
type SubscriptionUpdater = (current: ReportSubscription) => ReportSubscription

const mutationKey = ['user', 'report-subscription', 'update'] as const

/**
 * 구독 설정 저장. 누르자마자 바뀌어 보이게 캐시를 먼저 고친다
 * 에러 토스트는 공통 MutationCache가 띄운다
 *
 * 칩을 연달아 눌러도 앞 변경이 사라지지 않게
 * 바꿀 값은 화면이 아니라 캐시 기준으로 계산하고, PUT은 차례대로 보낸다
 *
 * @returns 저장 mutation. `mutate`에는 바꿀 값이 아니라 바꾸는 함수를 넘긴다
 */
export function useUpdateReportSubscription() {
  const queryClient = useQueryClient()
  const { queryKey } = subscriptionQueries.detail()

  return useMutation<void, Error, SubscriptionUpdater>({
    mutationKey,
    // 같은 scope는 하나씩 보낸다. 동시에 보내면 늦게 도착한 요청이 앞 변경을 덮을 수 있다
    scope: { id: mutationKey.join('/') },
    // 본문은 보내는 시점의 캐시로 만든다. 앞에서 누른 변경이 모두 담긴다
    mutationFn: async () => {
      const latest = queryClient.getQueryData(queryKey)
      // 로그아웃으로 캐시가 비었으면 보낼 사람이 없다
      if (latest) await updateReportSubscription(latest)
    },
    onMutate: async (update) => {
      // 진행 중인 조회가 늦게 도착해 방금 바꾼 값을 덮지 않게 멈춘다
      await queryClient.cancelQueries({ queryKey })
      // 기다리는 사이 로그아웃으로 캐시가 비었으면 이전 사람의 값을 다시 만들지 않는다
      if (!queryClient.getQueryData(queryKey)) return
      queryClient.setQueryData(
        queryKey,
        (current) => current && update(current),
      )
    },
    /* 실패해도 따로 되돌리지 않는다. 연달아 누른 경우 저장 직전 값으로 돌리면 뒤 변경까지 지워진다
       마지막 저장이 끝나면 서버 값으로 맞추고, 그 전에 다시 조회하면 아직 안 보낸 변경이 덮인다 */
    onSettled: () => {
      if (queryClient.isMutating({ mutationKey }) === 1) {
        return queryClient.invalidateQueries({ queryKey })
      }
    },
  })
}
