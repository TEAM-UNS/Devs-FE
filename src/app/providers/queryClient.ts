import { MutationCache, QueryClient } from '@tanstack/react-query'
import { errorMessage } from '@/shared/api'
import { useToastStore } from '@/shared/stores/useToastStore'

/**
 * 앱과 테스트가 같은 규칙(특히 실패 시 에러 토스트)을 쓰도록 생성을 한 곳에 둔다.
 * 테스트는 캐시가 새지 않게 매번 새 인스턴스를 만든다.
 *
 * @returns 설정이 끝난 QueryClient
 */
export function createQueryClient(): QueryClient {
  return new QueryClient({
    // 실패한 변경은 전부 에러 토스트를 띄운다. 각 호출부에서 onError를 되풀이하면
    // 새 뮤테이션이 그걸 빠뜨렸을 때 실패가 조용히 묻힌다.
    // 다르게 처리해야 하는 곳만 자기 onError를 추가로 둔다(둘 다 실행된다).
    mutationCache: new MutationCache({
      onError: (error) =>
        useToastStore.getState().show({
          type: 'error',
          title: errorMessage(error),
        }),
    }),
    defaultOptions: {
      queries: {
        staleTime: 60_000, // 1분간 fresh — 불필요한 재요청 방지
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  })
}

export const queryClient = createQueryClient()
