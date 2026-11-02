import { queryOptions } from '@tanstack/react-query'
import { RETROSPECT_QUERY_KEY } from '@/shared/api'
import { fetchMyRetrospects, fetchRetrospects } from './requests'

export const retrospectQueries = {
  all: () => RETROSPECT_QUERY_KEY,

  list: () =>
    queryOptions({
      queryKey: [...retrospectQueries.all(), 'list'] as const,
      queryFn: fetchRetrospects,
    }),

  mine: () =>
    queryOptions({
      queryKey: [...retrospectQueries.all(), 'mine'] as const,
      queryFn: fetchMyRetrospects,
    }),
}
