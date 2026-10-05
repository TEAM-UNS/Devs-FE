// mypageApi는 타입만 담고 전부 공개 대상이라 통째로 내보낸다
export type * from './mypageApi'

/** 리포트 구독 방식. 전체·분야별은 동시에 켤 수 없고, 둘 다 끌 수도 있다 */
export type SubscriptionMode = 'all' | 'fields' | 'none'

/** 커리어 목표 카드의 한 줄 — 라벨과 현재 값, 수정 화면으로 가는 행이다 */
export interface CareerGoal {
  id: string
  label: string
  value: string
}

/** 마이페이지가 그리는 사용자 정보 한 덩어리 */
export interface MyProfile {
  name: string
  email: string
  career: string
  majors: string
  skills: string[]
  subscriptionMode: SubscriptionMode
  subscribedFields: string[]
  careerGoals: CareerGoal[]
}
