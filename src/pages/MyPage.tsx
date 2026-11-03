import { MyPageOverview } from '@/features/mypage'
import { useMyRetrospects } from '@/features/retrospect'
import { PageTitle } from '@/shared/components/PageTitle'

/**
 * 마이페이지. pages는 feature를 조립만 하고 로직은 두지 않는다.
 * 기본 export → router의 React.lazy가 청크 단위로 불러올 수 있다.
 *
 * @returns 프로필·구독·내 커리어 관리가 배치된 마이페이지 화면
 */
export default function MyPage() {
  // 마이페이지와 회고는 서로 다른 feature라 개수는 여기서 이어 준다
  const retrospects = useMyRetrospects()

  return (
    <>
      <PageTitle name="마이페이지" />
      <MyPageOverview retrospectCount={retrospects.data?.length} />
    </>
  )
}
