import { RoadmapList } from '@/features/roadmap'
import { PageTitle } from '@/shared/components/PageTitle'

/**
 * 로드맵 목록 페이지. pages는 feature를 조립만 하고 로직은 두지 않는다.
 *
 * @returns 내 로드맵 목록 화면
 */
export default function RoadmapPage() {
  return (
    <>
      <PageTitle name="로드맵" />
      {/* 다른 화면처럼 페이지 여백 안에서 최대 1380 (Figma 1396:6908) */}
      <div className="mx-auto w-full max-w-[1380px]">
        <RoadmapList />
      </div>
    </>
  )
}
