import { RoadmapCreate } from '@/features/roadmap'
import { PageContainer } from '@/shared/components/PageContainer'
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
      <PageContainer className="h-full">
        <RoadmapCreate />
      </PageContainer>
    </>
  )
}
