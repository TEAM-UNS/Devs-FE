import { StackCompareResult } from '@/features/company'
import { PageTitle } from '@/shared/components/PageTitle'

/**
 * 기업 스택 비교 — 고른 기업들의 비교 결과
 *
 * @returns 인기 스택·공통 기술·언급량·매칭률·공고 수 비교 화면
 */
export default function StackCompareResultPage() {
  return (
    <>
      <PageTitle name="기업 스택 비교 결과" />
      <StackCompareResult />
    </>
  )
}
