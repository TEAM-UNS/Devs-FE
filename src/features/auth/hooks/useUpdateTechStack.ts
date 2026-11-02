import { useMutation, useQueryClient } from '@tanstack/react-query'
import { userQueries } from '@/shared/api'
import { updateTechStack } from '../api'

/**
 * 마이페이지에서 기술 스택을 고친다. (PUT /user/tech-stack)
 *
 * 저장되면 `/user/my`를 무효화해 기술 스택 카드가 새 값을 다시 받는다.
 * 실패 토스트는 공용 MutationCache가 띄운다.
 */
export function useUpdateTechStack() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateTechStack,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: userQueries.all() }),
  })
}
