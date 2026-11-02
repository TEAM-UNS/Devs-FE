import { queryOptions } from '@tanstack/react-query'
import { fetchMyRetrospects, fetchRetrospects } from './requests'

export const retrospectQueries = {
  all: () => ['retrospect'] as const,

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
