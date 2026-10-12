import { queryOptions } from '@tanstack/react-query'
import type { ReportPeriod } from '../types'
import {
  fetchLlmReport,
  fetchMaxDecrease,
  fetchMaxIncrease,
  fetchPopularTechStack,
  fetchTechMentions,
  fetchWeeklyCollectedCount,
} from './requests'

export const reportQueries = {
  all: () => ['report'] as const,

  llmReport: (baseDate: string, majorId?: number) =>
    queryOptions({
      queryKey: [
        ...reportQueries.all(),
        'llm',
        baseDate,
        majorId ?? null,
      ] as const,
      queryFn: () => fetchLlmReport(baseDate, majorId),
    }),

  popularTechStack: (
    majorId: number | undefined,
    period: ReportPeriod,
    baseDate: string,
  ) =>
    queryOptions({
      queryKey: [
        ...reportQueries.all(),
        'popular-tech-stack',
        majorId ?? null,
        period,
        baseDate,
      ] as const,
      queryFn: () => fetchPopularTechStack(majorId, period, baseDate),
    }),

  maxIncrease: (baseDate: string, majorId?: number) =>
    queryOptions({
      queryKey: [
        ...reportQueries.all(),
        'max-increase',
        baseDate,
        majorId ?? null,
      ] as const,
      queryFn: () => fetchMaxIncrease(baseDate, majorId),
    }),

  maxDecrease: (baseDate: string, majorId?: number) =>
    queryOptions({
      queryKey: [
        ...reportQueries.all(),
        'max-decrease',
        baseDate,
        majorId ?? null,
      ] as const,
      queryFn: () => fetchMaxDecrease(baseDate, majorId),
    }),

  techMentions: (baseDate: string, majorId?: number) =>
    queryOptions({
      queryKey: [
        ...reportQueries.all(),
        'tech-mentions',
        baseDate,
        majorId ?? null,
      ] as const,
      queryFn: () => fetchTechMentions(baseDate, majorId),
    }),

  weeklyCollectedCount: (baseDate: string) =>
    queryOptions({
      queryKey: [
        ...reportQueries.all(),
        'weekly-collected-count',
        baseDate,
      ] as const,
      queryFn: () => fetchWeeklyCollectedCount(baseDate),
    }),
}
