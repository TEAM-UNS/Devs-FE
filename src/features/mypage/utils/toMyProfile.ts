import type { MyProfile, UserMyQueryResponse } from '../types'

type PersonalHistory = UserMyQueryResponse['personalHistory']

/*
 * 서버 경력 ENUM → 마이페이지 표기
 * 연차 구간은 회원가입에서 고르는 구간(~1년·1년~3년·3년~5년·5년~)과 맞췄다
 * 같은 사람이 가입 때 고른 구간과 다르게 보이면 헷갈린다
 */
const CAREER_LABELS: Record<PersonalHistory, string> = {
  NO_EXPERIENCE: '경력 없음',
  ENTRY_LEVEL: '1년 미만 (신입)',
  JUNIOR: '1~3년 차 (주니어)',
  MIDDLE: '3~5년 차 (미들)',
  SENIOR: '5년 차 이상 (시니어)',
}

/** `/user/my` 응답을 프로필 요약·기술 스택 카드가 쓰는 값으로 바꾼다 */
export function toMyProfile(
  response: UserMyQueryResponse,
): Pick<MyProfile, 'name' | 'email' | 'career' | 'majors' | 'skills'> {
  return {
    name: response.name,
    email: response.email,
    career: CAREER_LABELS[response.personalHistory],
    // 전공 이름은 서버가 표시용으로 준다 ('백엔드' 등)
    majors: response.majors.map(({ majorName }) => majorName).join(', '),
    skills: response.techStacks.map(({ skillName }) => skillName),
  }
}
