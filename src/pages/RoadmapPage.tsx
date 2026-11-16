import { Roadmap } from '@/features/roadmap'
import { PageTitle } from '@/shared/components/PageTitle'

/**
 * 로드맵 페이지. pages는 feature를 조립만 하고 로직은 두지 않는다.
 *
 * @returns 학습률·Day별 학습 항목 화면
 */
export default function RoadmapPage() {
  return (
    <>
      <PageTitle name="로드맵" />
      {/* 다른 화면처럼 페이지 여백 안에서 최대 1380 (Figma 1396:6908) */}
      <div className="mx-auto h-full w-full max-w-[1380px]">
        <Roadmap />
      </div>
    </>
  )
}
