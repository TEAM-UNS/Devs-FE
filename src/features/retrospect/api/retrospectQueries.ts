import { queryOptions } from '@tanstack/react-query'
import { fetchRetrospects } from './requests'

export const retrospectQueries = {
  all: () => ['retrospect'] as const,

  list: () =>
    queryOptions({
      queryKey: [...retrospectQueries.all(), 'list'] as const,
      queryFn: fetchRetrospects,
    }),
}
