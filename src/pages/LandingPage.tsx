import { LandingOverview } from '@/features/landing'
import { PageTitle } from '@/shared/components/PageTitle'

/**
 * 랜딩 페이지. 비로그인 방문자가 처음 보는 화면
 * 기본 export → router의 React.lazy가 청크 단위로 불러올 수 있다
 */
export default function LandingPage() {
  return (
    <>
      <PageTitle />
      <LandingOverview />
    </>
  )
}
