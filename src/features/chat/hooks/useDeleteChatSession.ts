import { useMutation, useQueryClient } from '@tanstack/react-query'
import { chatQueries } from '../api'
import { deleteChatSession } from '../api/requests'
import { isNotFound } from '../utils/isNotFound'

/**
 * 대화 삭제. 목록에서 숨기는 건 부르는 쪽이 먼저 하고, 여기서는 서버에 지우고 목록을 다시 받는다
 * 에러 토스트는 공통 MutationCache가 띄운다
 */
export function useDeleteChatSession() {
  const queryClient = useQueryClient()

  return useMutation({
    /* 404는 이미 지워졌거나(다른 탭) 내 대화가 아니라는 뜻이라, 어느 쪽이든 목록에서 빠지는 게 맞다
       실패로 두면 숨긴 대화가 되살아나고 에러 토스트까지 뜬다 */
    mutationFn: async (sessionId: number) => {
      try {
        await deleteChatSession(sessionId)
      } catch (error) {
        if (!isNotFound(error)) throw error
      }
    },
    onSuccess: (_, sessionId) => {
      queryClient.removeQueries({
        queryKey: chatQueries.messages(sessionId).queryKey,
      })
      return queryClient.invalidateQueries({
        queryKey: chatQueries.sessions().queryKey,
      })
    },
  })
}
