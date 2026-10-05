import { queryOptions } from '@tanstack/react-query'
import { fetchMyProfile } from './requests'

/** 마이페이지 조회 정의 */
export const mypageQueries = {
  all: () => ['mypage'] as const,

  profile: () =>
    queryOptions({
      queryKey: [...mypageQueries.all(), 'profile'] as const,
      queryFn: fetchMyProfile,
    }),
}
