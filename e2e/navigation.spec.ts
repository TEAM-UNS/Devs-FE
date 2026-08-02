import { expect, test } from '@playwright/test'

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
