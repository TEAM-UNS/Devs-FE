import { queryOptions } from '@tanstack/react-query'
import { fetchChatMessages, fetchChatSessions } from './requests'

export const chatQueries = {
  all: () => ['chat'] as const,

  sessions: () =>
    queryOptions({
      queryKey: [...chatQueries.all(), 'sessions'] as const,
      queryFn: fetchChatSessions,
    }),

  messages: (sessionId: number) =>
    queryOptions({
      queryKey: [...chatQueries.all(), 'messages', sessionId] as const,
      queryFn: () => fetchChatMessages(sessionId),
    }),
}
