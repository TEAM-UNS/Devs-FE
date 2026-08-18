import { queryOptions } from '@tanstack/react-query'
import { fetchTechTrends } from './requests'

/**
 * 기술 트렌드 쿼리 정의 팩토리.
 * 키 + queryFn을 한곳에 모아, 컴포넌트는 `useQuery(trendQueries.list())`로 직접 호출한다.
 * 계층형 키라서 `invalidateQueries({ queryKey: trendQueries.all() })`로 관련 캐시를
 * 한 번에 무효화한다. (조회는 껍데기 훅 없이 이 팩토리로 처리)
 */
export const trendQueries = {
  all: () => ['tech-trends'] as const,
  list: () =>
    queryOptions({
      queryKey: [...trendQueries.all(), 'list'] as const,
      queryFn: fetchTechTrends,
    }),
}
