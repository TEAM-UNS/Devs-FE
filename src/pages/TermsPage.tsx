import { TermsOfService } from '@/features/legal'
import { PageTitle } from '@/shared/components/PageTitle'

/** 서비스 이용약관. 로그인 없이 열린다 */
export default function TermsPage() {
  return (
    <>
      <PageTitle name="이용약관" />
      <TermsOfService />
    </>
  )
}
