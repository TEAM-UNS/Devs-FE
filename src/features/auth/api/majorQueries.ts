import { queryOptions } from '@tanstack/react-query'
import { fetchMajors } from './requests'

/**
 * 전공·기술 스택 목록 쿼리 정의.
 *
 * 회원가입 3·4단계가 같은 목록을 쓰므로 팩토리로 모아 캐시를 공유한다.
 * 거의 바뀌지 않는 목록이라 `staleTime`을 길게 둬 단계 이동마다 재요청하지 않는다.
 */
export const majorQueries = {
  all: () => ['majors'] as const,
  list: () =>
    queryOptions({
      queryKey: [...majorQueries.all(), 'list'] as const,
      queryFn: fetchMajors,
      staleTime: 30 * 60 * 1000,
    }),
}
