import { WeeklyReport } from '@/features/report'

/**
 * 주간 리포트 페이지. pages는 feature를 조립만 하고 로직은 두지 않는다.
 * 기본 export → router의 React.lazy가 청크 단위로 불러올 수 있다.
 *
 * @returns 주차별 채용 공고 분석 결과 화면
 */
export default function WeeklyReportPage() {
  return <WeeklyReport />
}
