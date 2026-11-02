/* 서버 진행률은 주가 다 만들어질 때만 오르고, 실제로는 0에 머물다 완료 때 100으로 뛴다
   그래서 안내 문구(약 2분)에 맞춘 추정치를 함께 쓴다. 완료 전에는 90을 넘지 않는다 */
const ESTIMATE_CAP = 90
// 2분이면 추정치가 약 85%
const ESTIMATE_TIME_CONSTANT_MS = 40_000

/** 만들기 시작하고 elapsedMs가 지났을 때의 추정 진행률(0~90) */
export function estimateProgress(elapsedMs: number): number {
  return ESTIMATE_CAP * (1 - Math.exp(-elapsedMs / ESTIMATE_TIME_CONSTANT_MS))
}

/** 화면에 그릴 목표 — 완료면 100, 아니면 서버 값과 추정치 중 큰 쪽 */
export function targetProgress(
  serverProgress: number,
  elapsedMs: number,
  completed: boolean,
): number {
  if (completed) return 100
  return Math.max(serverProgress, estimateProgress(elapsedMs))
}

// 한 틱에 남은 거리의 30%씩 다가간다. 0.5 안이면 목표에 붙인다
const FOLLOW_RATE = 0.3
const SNAP_DISTANCE = 0.5

/** 지금 그린 값에서 목표로 한 틱 다가간 값 — 서버 값이 뛰어도 막대·숫자가 이어서 오른다 */
export function followProgress(shown: number, target: number): number {
  const next = shown + (target - shown) * FOLLOW_RATE
  return Math.abs(target - next) < SNAP_DISTANCE ? target : next
}
