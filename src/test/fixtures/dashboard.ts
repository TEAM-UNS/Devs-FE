import type {
  BestTechStacksResponse,
  CompanySizeTechStacksResponse,
  DashboardSummaryResponse,
  PopularTechStacksResponse,
} from '@/features/dashboard/types'

/** GET /dashboard/summary 응답 대역. 명세 예시를 따른다. */
export const MOCK_SUMMARY: DashboardSummaryResponse = {
  todayCollectedCount: 189,
  todayDiff: -62,
  activeCompanyCount: 56,
  companyDiff: 0,
  mostMentionedTech: { name: 'React', count: 123 },
  mostRisingTech: { name: 'Next.js', rate: 74 },
}

/** 집계 대상이 없을 때 — 이름이 null로 온다. */
export const MOCK_SUMMARY_EMPTY: DashboardSummaryResponse = {
  todayCollectedCount: 0,
  todayDiff: 0,
  activeCompanyCount: 0,
  companyDiff: 0,
  mostMentionedTech: { name: null, count: 0 },
  mostRisingTech: { name: null, rate: 0 },
}

export const MOCK_POPULAR: PopularTechStacksResponse = {
  major: 'BACKEND',
  techStacks: [
    { rank: 1, techStackId: 141, name: 'AWS', count: 264 },
    { rank: 2, techStackId: 122, name: 'Java', count: 262 },
    { rank: 3, techStackId: 133, name: 'REST API', count: 206 },
  ],
}

export const MOCK_COMPANY_SIZE: CompanySizeTechStacksResponse = {
  companySize: 'STARTUP',
  category: 'BACKEND',
  techStacks: [
    { rank: 1, name: 'AWS', percentage: 53 },
    { rank: 2, name: 'Java', percentage: 49 },
    { rank: 3, name: 'REST API', percentage: 40 },
  ],
}

export const MOCK_RISING: BestTechStacksResponse = {
  period: 'MONTH',
  majorId: 2,
  techStacks: [
    {
      techStackId: 8,
      name: 'Next.js',
      values: [
        { date: '2026-07-01', value: 13 },
        { date: '2026-07-08', value: 18 },
      ],
    },
    {
      techStackId: 15,
      name: 'LangChain',
      values: [
        { date: '2026-07-01', value: 9 },
        { date: '2026-07-08', value: 21 },
      ],
    },
  ],
}
