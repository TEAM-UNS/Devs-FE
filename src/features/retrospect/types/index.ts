/** GET /retrospect 한 항목 (Devs-BE RetrospectAllQueryResponse). 이번 주(월 9시 이후) 회고만 최신순으로 온다 */
export interface Retrospect {
  retrospectId: number
  dayNo: number
  content: string
  /** 'YYYY-MM-DD' (서울 기준) */
  date: string
  likeCount: number
  /** 내가 좋아요를 눌렀는지 */
  liked: boolean
}
