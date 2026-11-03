import { useMutation, useQueryClient } from '@tanstack/react-query'
import { trackEvent } from '@/shared/analytics'
import { retrospectQueries } from '../api/retrospectQueries'
import { likeRetrospect, unlikeRetrospect } from '../api/requests'
import { applyLike } from '../utils/applyLike'

/**
 * 좋아요 누르기·취소. 응답을 기다렸다가 서버가 준 개수로 캐시를 고친다
 * 에러 토스트는 공통 MutationCache가 띄운다
 */
export function useToggleLike() {
  const queryClient = useQueryClient()
  const { queryKey } = retrospectQueries.list()

  return useMutation({
    mutationFn: ({
      retrospectId,
      liked,
    }: {
      retrospectId: number
      liked: boolean
    }) =>
      liked ? unlikeRetrospect(retrospectId) : likeRetrospect(retrospectId),
    onSuccess: (response) => {
      trackEvent('Retrospect Liked', { liked: response.liked })
      queryClient.setQueryData(
        queryKey,
        (current) => current && applyLike(current, response),
      )
    },
  })
}
