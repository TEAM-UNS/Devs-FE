import type { Retrospect, RetrospectLikeResponse } from '../types'

/** 좋아요 응답을 목록에 반영한다 — 그 회고의 개수와 내가 눌렀는지만 바뀐다 (원본 불변) */
export function applyLike(
  retrospects: readonly Retrospect[],
  { retrospectId, likeCount, liked }: RetrospectLikeResponse,
): Retrospect[] {
  return retrospects.map((retrospect) =>
    retrospect.retrospectId === retrospectId
      ? { ...retrospect, likeCount, liked }
      : retrospect,
  )
}
