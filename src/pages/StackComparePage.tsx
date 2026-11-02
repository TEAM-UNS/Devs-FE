import { StackCompareSelect } from '@/features/company'
import { PageContainer } from '@/shared/components/PageContainer'
import { PageTitle } from '@/shared/components/PageTitle'

/**
 * 기업 스택 비교 — 비교할 기업 고르기
 *
 * @returns 기업 검색·선택 화면
 */
export default function StackComparePage() {
  return (
    <>
      <PageTitle name="기업 스택 비교" />
      <PageContainer className="h-full">
        <StackCompareSelect />
      </PageContainer>
    </>
  )
}
