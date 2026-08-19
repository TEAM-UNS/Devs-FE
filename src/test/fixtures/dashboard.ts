import type {
  BestTechStacksResponse,
  CompanySizeTechStacksResponse,
  DashboardSummaryResponse,
  PopularTechStacksResponse,
} from '@/features/dashboard/types'

/** GET /dashboard/summary 응답 대역. 명세 예시를 따른다. */
export const MOCK_SUMMARY: DashboardSummaryResponse = {
  today_collected_count: 189,
  today_diff: -62,
  active_company_count: 56,
  company_diff: 0,
  most_mentioned_tech: { name: 'React', count: 123 },
  most_rising_tech: { name: 'Next.js', rate: 74 },
}

/** 집계 대상이 없을 때 — 이름이 null로 온다. */
export const MOCK_SUMMARY_EMPTY: DashboardSummaryResponse = {
  today_collected_count: 0,
  today_diff: 0,
  active_company_count: 0,
  company_diff: 0,
  most_mentioned_tech: { name: null, count: 0 },
  most_rising_tech: { name: null, rate: 0 },
}

export const MOCK_POPULAR: PopularTechStacksResponse = {
  major: 'BACKEND',
  tech_stacks: [
    { rank: 1, tech_stack_id: 141, name: 'AWS', count: 264 },
    { rank: 2, tech_stack_id: 122, name: 'Java', count: 262 },
    { rank: 3, tech_stack_id: 133, name: 'REST API', count: 206 },
  ],
}

export const MOCK_COMPANY_SIZE: CompanySizeTechStacksResponse = {
  company_size: 'STARTUP',
  category: 'BACKEND',
  tech_stacks: [
    { rank: 1, name: 'AWS', percentage: 53 },
    { rank: 2, name: 'Java', percentage: 49 },
    { rank: 3, name: 'REST API', percentage: 40 },
  ],
}

export const MOCK_RISING: BestTechStacksResponse = {
  period: 'MONTH',
  major_id: 2,
  tech_stacks: [
    {
      tech_stack_id: 8,
      name: 'Next.js',
      values: [
        { date: '2026-07-01', value: 13 },
        { date: '2026-07-08', value: 18 },
      ],
    },
    {
      tech_stack_id: 15,
      name: 'LangChain',
      values: [
        { date: '2026-07-01', value: 9 },
        { date: '2026-07-08', value: 21 },
      ],
    },
  ],
}
