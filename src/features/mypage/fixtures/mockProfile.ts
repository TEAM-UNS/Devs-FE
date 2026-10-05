import type { MyProfile } from '../types'

/** 구독 분야 칩 목록. 서버가 내려주기 전까지 디자인(node 659:4785)에 있는 8개를 쓴다 */
export const SUBSCRIPTION_FIELDS = [
  '백엔드',
  '프론트엔드',
  '모바일',
  '데이터/AI',
  'Devops/인프라',
  '보안',
  '임베디드',
  '게임',
] as const

/** API 연동 전까지 화면을 채우는 목데이터 */
export const MOCK_PROFILE: MyProfile = {
  name: '최하은',
  email: 'mare2mare6@gmail.com',
  career: '1~2년 차 (주니어)',
  majors: 'Frontend, Backend',
  skills: ['React', 'Vue.js', 'Next.js', 'TypeScript', 'Node.js'],
  subscriptionMode: 'fields',
  subscribedFields: ['프론트엔드', '데이터/AI'],
}
