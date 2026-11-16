import { WeeklyReport } from '@/features/report'
import { PageTitle } from '@/shared/components/PageTitle'

/**
 * 주간 리포트 페이지. pages는 feature를 조립만 하고 로직은 두지 않는다.
 * 기본 export → router의 React.lazy가 청크 단위로 불러올 수 있다.
 *
 * @returns 주차별 채용 공고 분석 결과 화면
 */
export default function WeeklyReportPage() {
  return (
    <>
      <PageTitle name="주간리포트" />
      {/* 공용 1120 틀(PageContainer)을 쓰지 않는다. 카드가 최대 1140이고, 좌우 이웃 카드가
          본문 영역 끝까지 걸쳐야 해서(Figma 1396:6267) 폭은 WeekDeck이 정한다 */}
      <WeeklyReport />
    </>
  )
}
