import { expect, test } from '@playwright/test'

// 앱 화면은 라우트 가드 뒤에 있다. 로그인 흐름 자체가 아니라 청크 로딩을 보는
// 테스트라, 실제 로그인 대신 토큰을 미리 심어 가드를 통과시킨다.
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('uns-access-token', 'e2e-access-token')
    localStorage.setItem('uns-refresh-token', 'e2e-refresh-token')
  })
})

test('사이드바로 이동하면 별도 lazy 청크가 로드된다', async ({ page }) => {
  await page.goto('/about')

  // 진입 확인 (소개 페이지는 자체 청크)
  await expect(page.getByRole('heading', { name: '소개' })).toBeVisible()

  // 메인페이지도 별도 청크 → 사이드바 클릭 시 로드되어 표시되어야 한다
  await page.getByRole('link', { name: '메인페이지' }).click()
  await expect(
    page.getByRole('heading', { name: '인기 기술 스택' }),
  ).toBeVisible()

  // 뒤로 가기 → 다시 소개
  await page.goBack()
  await expect(page.getByRole('heading', { name: '소개' })).toBeVisible()
})

test('토큰이 없으면 앱 화면 대신 로그인으로 보낸다', async ({ page }) => {
  await page.addInitScript(() => localStorage.clear())
  await page.goto('/about')

  await expect(page).toHaveURL(/\/login$/)
  await expect(
    page.getByRole('heading', { name: '다시 만나서 반가워요!' }),
  ).toBeVisible()
})
