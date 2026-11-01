import { RetrospectBoard } from '@/features/retrospect'
import { PageTitle } from '@/shared/components/PageTitle'

/**
 * 익명 회고 게시판. pages는 feature를 조립만 하고 로직은 두지 않는다.
 *
 * @returns 이번 주 회고가 흐르는 게시판 화면
 */
export default function RetrospectBoardPage() {
  return (
    <>
      <PageTitle name="익명 회고 게시판" />
      <RetrospectBoard />
    </>
  )
}
