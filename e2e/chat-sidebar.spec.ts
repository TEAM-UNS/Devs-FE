import { expect, test } from '@playwright/test'

for (const height of [720, 480]) {
  test(`세션이 많아도 목록만 스크롤되고 새 대화 버튼은 보인다 (${height}px)`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height })
    await page.addInitScript(() => {
      localStorage.setItem('uns-access-token', 'e2e-access-token')
      localStorage.setItem('uns-refresh-token', 'e2e-refresh-token')
    })
    await page.route('**/chat/sessions', (route) =>
      route.fulfill({
        json: {
          sessions: Array.from({ length: 50 }, (_, index) => ({
            id: index + 1,
            title: `대화 ${index + 1}`,
            lastMessageAt: '2026-10-12T12:00:00',
          })),
        },
      }),
    )
    await page.route('**/chat/sessions/50/messages', (route) =>
      route.fulfill({
        json: {
          sessionId: 50,
          title: '대화 50',
          messages: [{ id: 1, role: 'user', content: '마지막 대화 질문' }],
        },
      }),
    )
    await page.goto('/chat')

    const sidebar = page.getByRole('complementary')
    const list = sidebar.getByRole('list')
    const newChat = sidebar.getByRole('button', { name: '새 대화 시작' })
    await expect(list.getByRole('listitem')).toHaveCount(50)
    await expect(newChat).toBeInViewport({ ratio: 1 })
    const before = await newChat.boundingBox()

    await list.evaluate((element) => {
      element.scrollTop = element.scrollHeight
    })

    await expect
      .poll(() => list.evaluate((element) => element.scrollTop))
      .toBeGreaterThan(0)
    await expect(
      list.getByRole('button', { name: '대화 50', exact: true }),
    ).toBeInViewport({ ratio: 1 })
    await expect(newChat).toBeInViewport({ ratio: 1 })
    expect(await newChat.boundingBox()).toEqual(before)

    await list.getByRole('button', { name: '대화 50', exact: true }).click()
    await expect(page.getByText('마지막 대화 질문')).toBeVisible()
    await newChat.click()
    await expect(page).toHaveURL(/\/chat$/)
    await expect(
      page.getByText('백엔드 중 가장 인기있는 기술 스택'),
    ).toBeVisible()
  })
}
