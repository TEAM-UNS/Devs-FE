/**
 * 경력 연차 선택지. 화면(`CareerSelect`)과 서버 ENUM 변환(`toPersonalHistory`)이
 * 같은 값을 봐야 해서 여기 한 곳에 둔다 — 한쪽만 고치면 변환이 조용히 `NONE`으로 떨어진다.
 *
 * 목데이터다. 서버가 연차 목록을 내려주면 교체한다.
 */
export type CareerLevel = 'lt1' | '1to3' | '3to5' | 'gte5'

export const CAREER_LEVELS: { label: string; value: CareerLevel }[] = [
  { label: '~1년', value: 'lt1' },
  { label: '1년~3년', value: '1to3' },
  { label: '3년~5년', value: '3to5' },
  { label: '5년~', value: 'gte5' },
]
