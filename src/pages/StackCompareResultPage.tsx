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
      {/* 공용 1120 틀 대신 최신 디자인 폭(1380, Figma 1396:6846 · 1396:7925)을 쓴다 */}
      {/* data-page-margin: 모바일에서도 좌우 32 여백 (index.css) */}
      <div
        data-page-margin="wide"
        className="mx-auto h-full w-full max-w-[1380px]"
      >
        <StackCompareResult />
      </div>
    </>
  )
}
