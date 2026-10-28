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
      <Roadmap />
    </>
  )
}
