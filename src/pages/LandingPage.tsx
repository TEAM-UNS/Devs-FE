import { LandingOverview } from '@/features/landing'

/**
 * 랜딩 페이지. 비로그인 방문자가 처음 보는 화면
 * 기본 export → router의 React.lazy가 청크 단위로 불러올 수 있다
 */
export default function LandingPage() {
  // TODO: 로그인한 사용자가 들어오면 대시보드로 보낼지 — 라우트 가드에서 정한다
  return <LandingOverview />
}
