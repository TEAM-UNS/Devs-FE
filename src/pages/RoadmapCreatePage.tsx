import { RoadmapCreate } from '@/features/roadmap'
import { PageTitle } from '@/shared/components/PageTitle'

/**
 * 로드맵 만들기 — 직무·스택·기간·조건을 차례로 고른다
 *
 * @returns 단계별 로드맵 생성 화면
 */
export default function RoadmapCreatePage() {
  return (
    <>
      <PageTitle name="로드맵 만들기" />
      {/* 다른 화면처럼 페이지 여백 안에서 최대 1380 (Figma 1396:6908) */}
      <div className="mx-auto h-full w-full max-w-[1380px]">
        <RoadmapCreate />
      </div>
    </>
  )
}
