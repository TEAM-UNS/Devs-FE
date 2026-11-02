import type { Retrospect } from '../types'
import { MY_RETROSPECTS_MOCK } from '../mocks/myRetrospects'

/**
 * 내가 쓴 회고 목록
 * TODO: API가 생기면 쿼리로 바꾼다. 지금은 목 데이터(MY_RETROSPECTS_MOCK)
 */
export function useMyRetrospects(): Retrospect[] {
  return MY_RETROSPECTS_MOCK
}
