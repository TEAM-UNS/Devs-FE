import { del, get, post } from '@/shared/api'
import type { Retrospect, RetrospectLikeResponse } from '../types'

/** 이번 주(월요일 9시 이후) 회고를 최신순으로 조회 */
export async function fetchRetrospects(): Promise<Retrospect[]> {
  return get<Retrospect[]>('/retrospect')
}

/** 좋아요. 이미 눌렀으면 서버가 409를 준다 */
export async function likeRetrospect(
  retrospectId: number,
): Promise<RetrospectLikeResponse> {
  return post<RetrospectLikeResponse>(`/like/${retrospectId}`)
}

/** 좋아요 취소 */
export async function unlikeRetrospect(
  retrospectId: number,
): Promise<RetrospectLikeResponse> {
  return del<RetrospectLikeResponse>(`/like/${retrospectId}`)
}
