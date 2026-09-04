import type { TrendDirection } from '@/shared/components/TrendMark'

/*
 * 주간 리포트 화면이 쓰는 타입.
 *
 * ⚠️ 서버 API 명세가 아직 없다. 여기 있는 것은 전부 **디자인에서 역산한 화면용 모델**이고,
 * 명세가 나오면 스네이크케이스 DTO + 변환 함수로 갈아엎는다. 지금 타입에 힘주지 않는다.
 */

/** 직군 필터 칩. 디자인의 칩 4개 그대로이며 서버 값과 맞는지는 미확인이다. */
export type JobFilter = 'ALL' | 'FE' | 'BE' | 'SECURITY'

/** 헤더에 표시하는 한 주 구간. */
export interface WeekRange {
  /** 주차 표기 (예: `7월 2주차`) */
  label: string
  /** 시작일 표기 (예: `2026.07.06`) */
  start: string
  /** 종료일 표기 */
  end: string
}

/** 순위 리스트 한 줄 — `01 React 3,123건 ▲32`. */
export interface StackRank {
  id: string
  name: string
  /** 공고 건수 */
  count: number
  /** 지난 주 대비 방향 */
  trend: TrendDirection
  /** 증감 표시 숫자. 방향은 `trend`가 갖고 여기는 절댓값만 담는다 */
  delta: number
}

/** 주목할 만한 트렌드 KPI 카드 한 장. */
export interface TrendHighlight {
  /** 카드 제목 (예: `이번주 최대 상승`) */
  label: string
  /** 기술 이름 (예: `Next.js`) */
  name: string
  trend: TrendDirection
  /** 증감률. 양수면 `+`를 붙여 보여준다 */
  percent: number
}

/** 언급량 차트의 한 묶음 — 기술 하나에 지난 주·이번 주 막대가 붙는다. */
export interface MentionBar {
  name: string
  /**
   * 지난 주 언급량. 차트 높이 비율(0~100)이다.
   *
   * ⚠️ 원래는 건수를 받아 최댓값으로 정규화해야 하지만, 서버가 무엇을 주는지 모르고
   * 디자인의 막대 높이가 100 기준이라 지금은 비율을 그대로 담는다. 명세가 나오면
   * 건수 → 비율 변환을 이 타입 바깥(변환 함수)으로 옮긴다.
   */
  last: number
  /** 이번 주 언급량 비율(0~100) */
  current: number
}

/** 역량 태그 하나. 일부만 강조 색으로 칠해진다. */
export interface CompetencyTag {
  id: string
  label: string
  /** 강조 여부. ⚠️ 디자인에 기준이 없어 목데이터에서 임의로 지정했다 */
  highlighted: boolean
}

/** 역량 순위 한 줄 — 이름과 비중 게이지. */
export interface CompetencyRank {
  id: string
  label: string
  /** 비중(0~100) */
  percent: number
}

/**
 * 한 주치 리포트 전체. 카드 하나가 이 덩어리 하나를 그린다.
 *
 * 이웃 주차 카드도 같은 모양을 쓰므로, 캐러셀을 붙일 때 이 타입 배열만 넘기면 된다.
 */
export interface WeekReport {
  week: WeekRange
  /** 푸터에 쓰는 수집 공고 수 */
  collectedCount: number
  ranks: StackRank[]
  highlights: TrendHighlight[]
  mentions: MentionBar[]
  tags: CompetencyTag[]
  competencies: CompetencyRank[]
}
