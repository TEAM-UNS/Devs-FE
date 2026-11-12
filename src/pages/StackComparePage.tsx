import { StackCompareSelect } from '@/features/company'
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
      {/* 공용 1120 틀 대신 최신 디자인 폭(1380, Figma 1396:6846 · 1396:7925)을 쓴다 */}
      <div className="mx-auto h-full w-full max-w-[1380px]">
        <StackCompareSelect />
      </div>
    </>
  )
}
