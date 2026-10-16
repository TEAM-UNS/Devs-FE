import { MAX_COMPARE } from '../constants/compare'

/** URL 쿼리 키. `?ids=3,4,9` — 새로고침·뒤로가기·공유에도 같은 비교가 남는다 */
const IDS_PARAM = 'ids'

/**
 * URL에서 고른 기업 id를 고른 순서대로 읽는다
 * 숫자가 아닌 값과 중복은 버리고 상한(5개)까지만 쓴다
 */
export function parseCompareIds(params: URLSearchParams): number[] {
  const ids = (params.get(IDS_PARAM) ?? '')
    .split(',')
    .filter((value) => /^\d+$/.test(value))
    .map(Number)
    .filter((id) => id > 0)

  return [...new Set(ids)].slice(0, MAX_COMPARE)
}

/** 고른 기업 id를 쿼리 문자열로. `[3, 4, 9]` → `?ids=3,4,9` */
export function compareSearch(ids: readonly number[]): string {
  return `?${IDS_PARAM}=${ids.join(',')}`
}
