/* 비교하는 기업 순서대로 쓰는 차트 색. 최대 5개 — Figma 427:5220·489:2381 */
const COMPARE_COLORS = [
  'bg-chart-yellow',
  'bg-chart-mint',
  'bg-chart-cyan',
  'bg-chart-blue',
  'bg-chart-violet',
] as const

/** 비교 기업 수 상한. 색이 5개뿐이라 그 이상은 고를 수 없다. 매칭률 목록은 빈 줄로 이 수를 채운다 */
export const MAX_COMPARE = COMPARE_COLORS.length

/** 두 곳 이상 골라야 비교할 수 있다 — Figma 427:4136 비활성 버튼 문구 */
export const MIN_COMPARE = 2

/**
 * 비교 기업 목록에서 그 기업의 차트 색. 카드마다 응답 순서가 달라도 같은 기업은 같은 색이 되게
 * 고른 순서(`companies`)를 기준으로 찾는다
 */
export const colorOf = (
  companies: readonly { id: number }[],
  companyId: number,
) => COMPARE_COLORS[companies.findIndex(({ id }) => id === companyId)]

/** 범례·막대 아래처럼 좁은 자리에 쓰는 이름. '토스 (비바리퍼블리카)' → '토스' */
export const shortName = (name: string) => name.split(' (')[0]

/** 순위·순번을 두 자리로. 1 → '01' */
export const twoDigits = (n: number) => String(n).padStart(2, '0')
