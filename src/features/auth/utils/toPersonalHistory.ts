import type { PersonalHistory, SignupStep3Input } from '../types'
import type { CareerLevel } from './careerLevels'

/**
 * 연차 → 서버 ENUM.
 *
 * ⚠️ 명세에 대응표가 없어 개수가 1:1로 맞는 것만 보고 이은 매핑이다(연차 4개 ↔ ENUM 4개).
 * 백엔드 확인 전까지는 추정이므로, 확인되면 이 표만 고치면 된다.
 *
 * `Record<CareerLevel, …>`이라 `CAREER_LEVELS`에 항목이 늘면 여기서 타입 에러가 난다.
 */
const LEVEL_TO_HISTORY: Record<CareerLevel, PersonalHistory> = {
  lt1: 'ENTRY_LEVEL',
  '1to3': 'JUNIOR',
  '3to5': 'MIDDLE',
  gte5: 'SENIOR',
}

/* 조회는 넓은 타입으로 한다 — 스키마상 careerLevel은 임의 문자열이라 표에 없을 수 있고,
   `as CareerLevel`로 좁히면 위 Record의 검사가 무의미해지고 아래 기본값도 죽은 코드가 된다. */
const lookup: Record<string, PersonalHistory | undefined> = LEVEL_TO_HISTORY

/**
 * 3단계 경력 선택을 회원가입 요청의 `personalHistory` 값으로 바꾼다.
 *
 * @param career 3단계에서 고른 경력 유무·연차
 * @returns 서버 ENUM 값 ('경력 없음'이거나 표에 없는 연차면 `NO_EXPERIENCE`)
 */
export function toPersonalHistory(
  career: Partial<Pick<SignupStep3Input, 'careerType' | 'careerLevel'>>,
): PersonalHistory {
  if (career.careerType !== 'has' || !career.careerLevel) return 'NO_EXPERIENCE'

  return lookup[career.careerLevel] ?? 'NO_EXPERIENCE'
}
