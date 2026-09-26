import type { Page } from '@playwright/test'

/*
 * E2E에는 백엔드가 없다. preview 서버는 모르는 경로에도 index.html을 200으로 돌려주므로,
 * 가로채지 않으면 화면이 HTML을 응답으로 받아 그대로 터진다.
 * 여기서는 화면이 그려지는 데 필요한 최소 모양만 돌려준다.
 */
const RESPONSES: Record<string, unknown> = {
  '/majors': {
    categories: [
      { id: 1, major: 'FRONTEND', techStacks: [{ id: 1, name: 'React' }] },
    ],
  },
  '/dashboard/summary': {
    todayCollectedCount: 128,
    todayDiff: 12,
    activeCompanyCount: 34,
    companyDiff: -2,
    mostMentionedTech: { name: 'React', count: 42 },
    mostRisingTech: { name: 'Next.js', rate: 18 },
  },
  '/dashboard/popular-tech-stacks': {
    major: 'FRONTEND',
    techStacks: [{ rank: 1, techStackId: 1, name: 'React', count: 42 }],
  },
  '/dashboard/company-size-tech-stacks': {
    companySize: 'STARTUP',
    category: 'FRONTEND',
    techStacks: [{ rank: 1, name: 'React', percentage: 40 }],
  },
  '/dashboard/best-tech-stacks': {
    period: 'MONTH',
    majorId: 1,
    techStacks: [
      {
        techStackId: 1,
        name: 'React',
        values: [
          { date: '2026-09-01', value: 10 },
          { date: '2026-09-08', value: 20 },
        ],
      },
    ],
  },
}

/** 대시보드가 부르는 조회 API를 목 응답으로 바꿔 끼운다 */
export async function mockApi(page: Page) {
  for (const [path, body] of Object.entries(RESPONSES)) {
    await page.route(`**${path}?**`, (route) => route.fulfill({ json: body }))
    await page.route(`**${path}`, (route) => route.fulfill({ json: body }))
  }
}
