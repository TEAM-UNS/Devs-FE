import { PrivacyPolicy } from '@/features/legal'
import { PageTitle } from '@/shared/components/PageTitle'

/** 개인정보 처리방침. 로그인 없이 열린다 */
export default function PrivacyPage() {
  return (
    <>
      <PageTitle name="개인정보처리방침" />
      <PrivacyPolicy />
    </>
  )
}
