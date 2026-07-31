import { DashboardOverview } from '@/features/dashboard'

/**
 * 메인페이지(대시보드). pages는 feature를 조립만 하고 로직은 두지 않는다.
 * 기본 export → router의 React.lazy가 청크 단위로 불러올 수 있다.
 *
 * @returns KPI 카드와 차트 카드가 배치된 대시보드 화면
 */
export default function DashboardPage() {
  return <DashboardOverview />
}
