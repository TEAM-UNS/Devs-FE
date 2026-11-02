import { CREATE_STEPS } from '../constants/create'

/** URL 쿼리 키. `?step=2` */
export const STEP_PARAM = 'step'

const LAST_STEP = CREATE_STEPS.length

/** URL의 단계 번호. 없거나 잘못된 값은 1단계 */
export function parseStep(params: URLSearchParams): number {
  const step = Number(params.get(STEP_PARAM))
  return Number.isInteger(step) && step >= 1 && step <= LAST_STEP ? step : 1
}

/**
 * 지금 선택으로 갈 수 있는 가장 먼 단계
 * 선택값은 새로고침하면 사라져서, 빈 채로 뒤 단계 주소에 들어오면 여기까지 돌려보낸다
 */
export function reachableStep(
  majorId: number | null,
  skillCount: number,
): number {
  if (majorId === null) return 1
  if (skillCount === 0) return 2
  return LAST_STEP
}
