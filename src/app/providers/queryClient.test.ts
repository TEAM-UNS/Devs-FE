import { beforeEach, describe, expect, it } from 'vitest'
import { useToastStore } from '@/shared/stores/useToastStore'
import { createQueryClient } from './queryClient'

beforeEach(() => {
  useToastStore.setState({ toasts: [] })
})

describe('createQueryClient', () => {
  /* 서버가 죽으면 대시보드·주간 리포트처럼 요청을 여러 개 보내는 화면에서 쿼리가 한꺼번에
     같은 에러로 실패한다. 토스트가 쿼리 수만큼 쌓여 화면을 덮은 적이 있다 (#29) */
  it('한 화면의 쿼리 여러 개가 같은 에러로 실패해도 토스트는 한 장만 뜬다', async () => {
    const queryClient = createQueryClient()
    const fail = () => Promise.reject(new Error('Network Error'))

    await Promise.allSettled(
      ['summary', 'popular', 'rising', 'company', 'majors'].map((key) =>
        queryClient.fetchQuery({
          queryKey: [key],
          queryFn: fail,
          retry: false,
        }),
      ),
    )

    expect(useToastStore.getState().toasts).toHaveLength(1)
  })
})
