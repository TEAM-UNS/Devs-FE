import { MAX_WEEKS, MIN_WEEKS } from '../constants/create'

/** 기간을 서버 범위(1~12주) 안으로 자른다 */
export function clampWeeks(weeks: number): number {
  return Math.min(MAX_WEEKS, Math.max(MIN_WEEKS, weeks))
}

export type SlotTone = 'current' | 'near' | 'far'

export interface Slot {
  /** 가운데(현재 값)로부터 세로 거리(px) */
  y: number
  /** 48px 숫자를 줄이는 비율 */
  scale: number
  tone: SlotTone
  visible: boolean
}

/* Figma 562:4550 숫자 기둥 — 위 1칸(h2) · 현재(display 48) · 아래 2칸(h2, h4), 간격 4
   줄높이 1.2라 h2 = 28.8, display = 57.6, h4 = 19.2 */
const NEAR_Y = 57.6 / 2 + 4 + 28.8 / 2 // 47.2
const FAR_Y = NEAR_Y + 28.8 / 2 + 4 + 19.2 / 2 // 75.2
const FAR_STEP = 19.2 + 4

/**
 * 현재 값에서 distance칸 떨어진 숫자의 자리·크기·색
 * 보이지 않는 숫자도 같은 간격으로 이어 놓아야, 크게 바뀔 때 숫자들이 그 자리를 지나며 굴러간다
 */
export function slotOf(distance: number): Slot {
  if (distance === 0) return { y: 0, scale: 1, tone: 'current', visible: true }

  const side = Math.sign(distance)
  const steps = Math.abs(distance)
  if (steps === 1) {
    return { y: side * NEAR_Y, scale: 0.5, tone: 'near', visible: true }
  }
  return {
    y: side * (FAR_Y + (steps - 2) * FAR_STEP),
    scale: 1 / 3,
    tone: 'far',
    // Figma는 위에 1칸, 아래에 2칸만 보여준다
    visible: distance === 2,
  }
}

/* 한 칸 넘길 때 기본 시간 + 넘긴 칸만큼 더 돈다. 프리셋으로 1→12주처럼 크게 바뀌면
   더 길게 굴러가 "돌아가는 애니메이션"(Figma 주석)이 보이고, 너무 늘어지지 않게 상한을 둔다 */
const SPIN_BASE_MS = 200
const SPIN_PER_STEP_MS = 40
const SPIN_MAX_MS = 600

/** 바뀐 칸 수에 맞춘 굴러가는 시간(ms) */
export function spinDuration(steps: number): number {
  return Math.min(SPIN_MAX_MS, SPIN_BASE_MS + SPIN_PER_STEP_MS * steps)
}
