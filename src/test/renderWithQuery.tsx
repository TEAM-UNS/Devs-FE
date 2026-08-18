import type { ReactElement } from 'react'
import { render } from '@testing-library/react'
import { QueryClientProvider } from '@tanstack/react-query'
import { createQueryClient } from '@/app/providers/queryClient'

/**
 * QueryClientProvider로 감싸 렌더한다. `useQuery`/`useMutation`을 쓰는 컴포넌트용.
 *
 * 앱과 같은 설정으로 만든다 — 실패 시 에러 토스트 같은 전역 규칙까지 함께 검증하기 위해서다.
 * 테스트마다 새 인스턴스라 캐시가 새지 않고, 재시도는 꺼서 실패 케이스가 기다림 없이 끝난다.
 *
 * @param ui 렌더할 엘리먼트
 * @returns testing-library의 render 결과
 */
export function renderWithQuery(ui: ReactElement) {
  const queryClient = createQueryClient()
  queryClient.setDefaultOptions({
    queries: { retry: false },
    mutations: { retry: false },
  })

  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  )
}
