import { MyRetrospects } from '@/features/retrospect'
import { PageTitle } from '@/shared/components/PageTitle'

/** 내 회고 몰아보기 (/my/retrospects) */
export default function MyRetrospectsPage() {
  return (
    <>
      <PageTitle name="내 회고" />
      <MyRetrospects />
    </>
  )
}
