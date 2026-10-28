import { expect, test, type Locator } from '@playwright/test'

async function knobOffset(toggle: Locator) {
  return toggle.evaluate((input) => {
    const label = input.closest('label')!
    const knob = label.querySelectorAll('span')[1]
    return (
      knob.getBoundingClientRect().left - label.getBoundingClientRect().left
    )
  })
}

test('구독 토글 상태에 따라 동그라미 위치와 색상이 바뀐다', async ({
  page,
}) => {
  await page.addInitScript(() => {
    localStorage.setItem('uns-access-token', 'e2e-access-token')
    localStorage.setItem('uns-refresh-token', 'e2e-refresh-token')
  })
  await page.route('**/user/my', (route) =>
    route.fulfill({
      json: {
        name: '테스트 사용자',
        email: 'test@example.com',
        personalHistory: 'JUNIOR',
        majors: [{ majorId: 1, majorName: '프론트엔드' }],
        techStacks: [],
      },
    }),
  )
  await page.route('**/majors', (route) =>
    route.fulfill({
      json: { categories: [{ id: 1, major: 'FRONTEND', techStacks: [] }] },
    }),
  )
  // 저장한 값을 다음 조회에 돌려준다. 저장 뒤 다시 조회해 서버 값으로 맞추기 때문이다
  let subscription = { totalReport: false, majorReport: true, majorIds: [1] }
  await page.route('**/user/report-subscription', (route) => {
    if (route.request().method() === 'PUT') {
      subscription = route.request().postDataJSON()
      return route.fulfill({ status: 204 })
    }
    return route.fulfill({ json: subscription })
  })
  await page.goto('/my')

  const all = page.getByRole('switch', { name: '전체 리포트 구독' })
  const fields = page.getByRole('switch', { name: '분야별 리포트 구독' })
  const allKnob = page
    .locator('label')
    .filter({ has: all })
    .locator('span')
    .last()
  await expect(all).not.toBeChecked()
  await expect(fields).toBeChecked()
  await expect.poll(() => knobOffset(all)).toBe(2)
  await expect.poll(() => knobOffset(fields)).toBe(26)

  await page.locator('label').filter({ has: all }).click()
  await expect(all).toBeChecked()
  await expect(fields).not.toBeChecked()
  await expect.poll(() => knobOffset(all)).toBe(26)
  await expect.poll(() => knobOffset(fields)).toBe(2)
  await expect(allKnob).toHaveCSS('background-color', 'rgb(248, 243, 254)')

  await all.focus()
  await page.keyboard.press('Space')
  await expect(all).not.toBeChecked()
  await expect.poll(() => knobOffset(all)).toBe(2)
  await expect(allKnob).toHaveCSS('background-color', 'rgb(206, 212, 218)')
})
