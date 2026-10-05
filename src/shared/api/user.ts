import { queryOptions } from '@tanstack/react-query'
import { get } from './http'

/*
 * 로그인한 사용자 정보 (GET /user/my). 마이페이지(프로필)와 주간 리포트(전공 칩)가
 * 같이 쓰는데 feature끼리는 서로 참조할 수 없어 공용으로 올림
 * 같은 쿼리를 쓰니 두 화면을 오가도 요청은 한 번만 나간다
 *
 * 서버 엔티티가 전부 NOT NULL이라 nullable 필드는 없다. 전공·기술 스택이 없으면 빈 배열로 온다
 */

/** 사용자가 고른 전공 한 개 */
export interface UserMajorDto {
  majorId: number
  majorName: string
}

/** 사용자가 고른 기술 스택 한 개 */
export interface UserTechStackDto {
  skillId: number
  skillName: string
}

/** GET /user/my 응답 본문 */
export interface UserMyQueryResponse {
  name: string
  email: string
  personalHistory:
    'NO_EXPERIENCE' | 'ENTRY_LEVEL' | 'JUNIOR' | 'MIDDLE' | 'SENIOR'
  majors: UserMajorDto[]
  techStacks: UserTechStackDto[]
}

/** 로그인한 사용자의 프로필을 조회한다 */
export async function fetchMyProfile(): Promise<UserMyQueryResponse> {
  return get<UserMyQueryResponse>('/user/my')
}

/** 사용자 정보 쿼리 정의 */
export const userQueries = {
  all: () => ['user'] as const,
  me: () =>
    queryOptions({
      queryKey: [...userQueries.all(), 'me'] as const,
      queryFn: fetchMyProfile,
    }),
}
