import { get } from '@/shared/api'
import type { UserMyQueryResponse } from '../types'

/** 로그인한 사용자의 프로필을 조회한다. (GET /user/my) */
export async function fetchMyProfile(): Promise<UserMyQueryResponse> {
  return get<UserMyQueryResponse>('/user/my')
}
