import { useMutation, useQueryClient } from '@tanstack/react-query'
import { userQueries } from '@/shared/api'
import { updateMajor } from '../api'

/**
 * 마이페이지에서 전공·경력을 고친다. (PUT /user/major)
 *
 * 저장되면 `/user/my`를 무효화해 마이페이지와 리포트의 전공 칩이 새 값을 다시 받는다.
 * 서버는 빠진 전공의 기술 스택도 함께 지우므로 기술 스택 카드도 같이 바뀐다.
 * 실패 토스트는 공용 MutationCache가 띄운다.
 */
export function useUpdateMajor() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateMajor,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: userQueries.all() }),
  })
}
