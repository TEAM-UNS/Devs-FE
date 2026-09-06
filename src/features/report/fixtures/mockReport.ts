import { weekRangeAt } from '../utils/weekRange'
import type {
  CompetencyRank,
  CompetencyTag,
  MentionBar,
  StackRank,
  TrendHighlight,
  WeekReport,
} from '../types'

/*
 * ⚠️ 임시 목데이터. 주간 리포트 API 명세가 나오면 이 파일을 통째로 지운다.
 * 값은 Figma `리포트` 프레임(325:1962)에 그려진 것 그대로다.
 */

/** 푸터 문구에 들어가는 이번 주 수집 공고 수. */
const MOCK_COLLECTED_COUNT = 19_283

/**
 * 가장 많이 찾은 기술 스택 8행.
 *
 * 디자인 목업이 전 행을 `React`로 채워 두었지만, 그대로 옮기면 순위가 바뀌어도 화면이
 * 그대로여서 검증이 안 된다. 이름만 실제 스택으로 바꾸고 건수·증감은 목업 값을 따랐다.
 */
const MOCK_RANKS: StackRank[] = [
  { id: 'react', name: 'React', count: 3123, trend: 'up', delta: 32 },
  { id: 'ts', name: 'TypeScript', count: 3123, trend: 'up', delta: 32 },
  { id: 'next', name: 'Next.js', count: 3123, trend: 'up', delta: 32 },
  { id: 'vue', name: 'Vue.js', count: 2983, trend: 'down', delta: 12 },
  { id: 'svelte', name: 'Svelte', count: 1123, trend: 'flat', delta: 22 },
  { id: 'angular', name: 'Angular', count: 1123, trend: 'flat', delta: 22 },
  { id: 'nuxt', name: 'Nuxt', count: 2983, trend: 'down', delta: 12 },
  { id: 'remix', name: 'Remix', count: 3123, trend: 'up', delta: 32 },
]

/** 이번 주 주목할 만한 기술 트렌드 — 최대 상승 · 최대 하락. */
const MOCK_HIGHLIGHTS: TrendHighlight[] = [
  { label: '이번주 최대 상승', name: 'Next.js', trend: 'up', percent: 74 },
  { label: '이번주 최대 하락', name: 'React', trend: 'down', percent: -12 },
]

/** 주요 기술 언급량. 비율은 Figma 막대 높이(335:2355)를 그대로 옮겼다. */
const MOCK_MENTIONS: MentionBar[] = [
  { name: 'JavaScript', last: 77, current: 90 },
  { name: 'TypeScript', last: 77, current: 64 },
  { name: 'React', last: 90, current: 33 },
  { name: 'Vue.js', last: 77, current: 79 },
  { name: 'Next.js', last: 37, current: 20 },
]

/** 채용 공고·면접에 자주 나오는 역량 태그. 강조 위치도 디자인 목업을 따랐다. */
const MOCK_TAGS: CompetencyTag[] = [
  { id: 't1', label: '대용량 트래픽 처리', highlighted: false },
  { id: 't2', label: 'CI/CD 구축 경험', highlighted: true },
  { id: 't3', label: '테스트 자동화', highlighted: true },
  { id: 't4', label: '성능 최적화', highlighted: true },
  { id: 't5', label: '코드 리뷰', highlighted: false },
  { id: 't6', label: '장애 대응', highlighted: false },
  { id: 't7', label: '모니터링 구축', highlighted: false },
  { id: 't8', label: '컨테이너 운영', highlighted: false },
  { id: 't9', label: 'API 설계', highlighted: true },
  { id: 't10', label: '클라우드 인프라', highlighted: false },
  { id: 't11', label: '보안 점검', highlighted: false },
]

/** 역량 순위. 디자인은 네 줄 모두 82%지만 게이지가 움직이는지 보이도록 값을 나눴다. */
const MOCK_COMPETENCIES: CompetencyRank[] = [
  { id: 'c1', label: '대용량 트래픽 처리', percent: 82 },
  { id: 'c2', label: 'CI/CD 구축 경험', percent: 74 },
  { id: 'c3', label: '테스트 자동화', percent: 61 },
  { id: 'c4', label: '성능 최적화', percent: 48 },
]

/**
 * 한 주치 리포트 묶음.
 *
 * ⚠️ 이웃 주차(이전·다음)도 지금은 이 데이터를 그대로 쓴다. 좌우 카드는 50% 투명도로
 * 대부분 잘려 있어 내용이 거의 안 보이고, 주차별 데이터는 API가 생겨야 나온다.
 */
const MOCK_REPORT: WeekReport = {
  /* 기준 주차는 weekRange.ts가 혼자 정한다. 여기에 또 적어 두면 둘이 갈라진다. */
  week: weekRangeAt(0),
  collectedCount: MOCK_COLLECTED_COUNT,
  ranks: MOCK_RANKS,
  highlights: MOCK_HIGHLIGHTS,
  mentions: MOCK_MENTIONS,
  tags: MOCK_TAGS,
  competencies: MOCK_COMPETENCIES,
}

/**
 * 특정 주차의 리포트 한 벌.
 *
 * ⚠️ 카드 내용은 어느 주차든 같다. 주차별로 다른 숫자를 지어내면 검증에 도움이 안 되고,
 * API가 붙으면 어차피 서버 값으로 바뀐다. 지금 바뀌는 것은 헤더의 주차·날짜뿐이다.
 *
 * @param offset 기준 주(디자인에 그려진 주)로부터의 주 단위 거리. 음수면 과거
 */
export function mockReportAt(offset: number): WeekReport {
  return { ...MOCK_REPORT, week: weekRangeAt(offset) }
}
