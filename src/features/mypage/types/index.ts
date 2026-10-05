/** 리포트 구독 방식. 전체·분야별은 동시에 켤 수 없고, 둘 다 끌 수도 있다 */
export type SubscriptionMode = 'all' | 'fields' | 'none'

/** 마이페이지가 그리는 사용자 정보 한 덩어리 */
export interface MyProfile {
  name: string
  email: string
  career: string
  majors: string
  skills: string[]
  subscriptionMode: SubscriptionMode
  subscribedFields: string[]
}
