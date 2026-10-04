import { MyPageOverview } from '@/features/mypage'

/**
 * 마이페이지. pages는 feature를 조립만 하고 로직은 두지 않는다.
 * 기본 export → router의 React.lazy가 청크 단위로 불러올 수 있다.
 *
 * @returns 프로필·구독·커리어 목표가 배치된 마이페이지 화면
 */
export default function MyPage() {
  return <MyPageOverview />
}
