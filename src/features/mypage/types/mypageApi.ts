/*
 * mypage API의 응답 모양. 백엔드 `UserMyQueryResponse`(GET /user/my)를 그대로 옮긴 것이며,
 * 화면용 `MyProfile`과는 별개다.
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
  // auth의 PersonalHistory와 같은 값이지만 feature 간 참조가 막혀 있어 일단 풀어 쓴다
  personalHistory:
    'NO_EXPERIENCE' | 'ENTRY_LEVEL' | 'JUNIOR' | 'MIDDLE' | 'SENIOR'
  majors: UserMajorDto[]
  techStacks: UserTechStackDto[]
}
