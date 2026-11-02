import { useQuery } from '@tanstack/react-query'
import { retrospectQueries } from '../api/retrospectQueries'

/** 내가 쓴 회고 목록 — 몰아보기 화면과 마이페이지 개수가 같은 캐시를 쓴다 */
export function useMyRetrospects() {
  return useQuery(retrospectQueries.mine())
}
