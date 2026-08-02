import {
  BuildingIcon,
  ChartLineIcon,
  FlameIcon,
  MegaphoneIcon,
} from '@/shared/components/icons'
import type { DashboardData } from '../../types'

/**
 * ⚠️ 목데이터 — API 연동 시 전량 교체된다.
 * 값·라벨은 Figma 목업(데이터 있는 상태 178:1987 / 데이터 없는 상태 323:1653)에서
 * 그대로 옮긴 것이고, `id`는 코드에서 붙인 키다(서버 스펙 확정 시 교체 대상).
 */

// 막대 높이는 Figma에서 픽셀로 그려져 있어 막대 영역(120px)에 대한 비율로 옮긴다.
// ⚠️ popularStacks는 아직 어디서도 렌더되지 않는다 — 막대 그래프를 ECharts로 옮기는
//    중이라 자리만 비워 뒀고, 이 값들이 그때 시리즈 데이터가 된다.
const BAR_AREA = 120

// 필터 칩 목록. Database 다음 칩은 두 목업 프레임이 서로 달랐고(`C` vs `DevOps`)
// DevOps(323:1653 기준)로 확정했다.
const STACK_FILTERS = [
  '전체',
  'FE',
  'BE',
  'ios',
  'Android',
  'AI',
  'Security',
  'Database',
  'DevOps',
  'UX/UI',
] as const

const RISING_PERIODS = ['1주', '한 달'] as const

// 급상승 그래프의 시점 라벨(툴팁 전용). ⚠️ 날짜도 에이전트가 지어낸 목데이터다 —
// Figma 툴팁 시안이 '7월 21일'이라 그 언저리로 한 달치를 이틀 간격으로 잡았다.
const RISING_AXIS = [
  '7월 1일',
  '7월 3일',
  '7월 5일',
  '7월 7일',
  '7월 9일',
  '7월 11일',
  '7월 13일',
  '7월 15일',
  '7월 17일',
  '7월 19일',
  '7월 21일',
  '7월 23일',
  '7월 25일',
  '7월 27일',
  '7월 29일',
] as const

/** 데이터가 있는 기본 상태 (Figma 178:1987). */
export const DASHBOARD_MOCK: DashboardData = {
  kpis: [
    {
      id: 'collected-postings',
      label: '오늘 수집된 공고',
      value: '189',
      unit: '건',
      icon: MegaphoneIcon,
      caption: { prefix: '전일 대비', value: '-62', suffix: '건' },
      trend: 'down',
    },
    {
      id: 'active-companies',
      label: '활성 채용 기업',
      value: '56',
      unit: '개',
      icon: BuildingIcon,
      caption: { prefix: '전주 대비', value: '+0', suffix: '건' },
      trend: 'flat',
    },
    {
      id: 'most-mentioned',
      label: '이번주 최다 언급',
      value: 'React',
      icon: FlameIcon,
      caption: { prefix: '공고', value: '123', suffix: '건에 등장' },
    },
    {
      id: 'biggest-riser',
      label: '이번주 최대 상승',
      value: 'Next.js',
      icon: ChartLineIcon,
      caption: { prefix: '전주 대비', value: '+74', suffix: '%' },
      trend: 'up',
    },
  ],
  stackFilters: STACK_FILTERS,
  selectedStackFilter: 'FE',
  popularStacks: [
    { id: 'javascript', label: 'JavaScript', ratio: 110 / BAR_AREA },
    { id: 'typescript', label: 'TypeScript', ratio: 104 / BAR_AREA },
    { id: 'react', label: 'React', ratio: 89 / BAR_AREA },
    { id: 'vue', label: 'Vue.js', ratio: 81 / BAR_AREA },
    { id: 'next', label: 'Next.js', ratio: 75 / BAR_AREA },
    { id: 'tailwind', label: 'Tailwind CSS', ratio: 68 / BAR_AREA },
    {
      id: 'styled-components',
      label: 'Styled-components',
      ratio: 54 / BAR_AREA,
    },
    { id: 'zustand', label: 'Zustand', ratio: 39 / BAR_AREA },
    { id: 'redux', label: 'Redux', ratio: 20 / BAR_AREA },
  ],
  companyScale: '스타트업',
  companyRanks: [
    { id: 'react', name: 'React', percent: 82 },
    { id: 'typescript', name: 'TypeScript', percent: 82 },
    { id: 'node', name: 'Node.js', percent: 82 },
    { id: 'aws', name: 'AWS', percent: 82 },
    { id: 'next', name: 'Next.js', percent: 82 },
  ],
  risingPeriods: RISING_PERIODS,
  selectedRisingPeriod: '한 달',
  // ⚠️ 곡선 값은 에이전트가 지어낸 목데이터다. Figma의 영역 그래프는 데이터가 없는
  //    그림이라 굴곡을 그대로 옮길 수 없었다. 색·그라디언트·블렌드 같은 시각 처리는
  //    Figma(288:987)와 일치하지만 곡선 모양은 다르다. 서버 연동 시 전량 교체.
  //    최대치는 Figma의 각 영역 높이 비(155 : 103 : 69 : 36)를 대략 따랐다.
  risingAxis: RISING_AXIS,
  risingSeries: [
    {
      id: 'next',
      label: 'Next.js',
      values: [18, 22, 20, 28, 34, 31, 40, 46, 43, 52, 58, 55, 62, 66, 64],
    },
    {
      id: 'langchain',
      label: 'LangChain',
      values: [4, 6, 5, 8, 7, 10, 9, 12, 14, 13, 16, 18, 17, 21, 23],
    },
    {
      id: 'terraform',
      label: 'Terraform',
      values: [12, 14, 13, 17, 16, 20, 24, 22, 27, 30, 28, 33, 36, 34, 39],
    },
    {
      id: 'rust',
      label: 'Rust',
      values: [30, 36, 44, 41, 55, 68, 62, 78, 85, 80, 92, 88, 96, 100, 97],
    },
  ],
}

/**
 * 데이터가 없는 상태 (Figma 323:1653).
 * ⚠️ 목업 자체가 일관되지 않다 — KPI는 전부 0인데 인기 기술 스택은 앞 5개 막대가
 * 그려져 있다. 실제로는 "일부만 집계된" 상태에 가까우므로 그대로 옮겼다.
 */
export const DASHBOARD_EMPTY_MOCK: DashboardData = {
  kpis: [
    {
      id: 'collected-postings',
      label: '오늘 수집된 공고',
      value: '0',
      unit: '건',
      icon: MegaphoneIcon,
      caption: { prefix: '전일 대비', value: '+0', suffix: '건' },
      trend: 'flat',
    },
    {
      id: 'active-companies',
      label: '활성 채용 기업',
      value: '0',
      unit: '개',
      icon: BuildingIcon,
      caption: { prefix: '전주 대비', value: '+0', suffix: '건' },
      trend: 'flat',
    },
    {
      id: 'most-mentioned',
      label: '이번주 최다 언급',
      value: '-',
      icon: FlameIcon,
      caption: { prefix: '공고', value: '0', suffix: '건에 등장' },
    },
    {
      id: 'biggest-riser',
      label: '이번주 최대 상승',
      value: '-',
      icon: ChartLineIcon,
      caption: { prefix: '전주 대비', value: '+0', suffix: '%' },
      trend: 'flat',
    },
  ],
  stackFilters: STACK_FILTERS,
  selectedStackFilter: 'FE',
  popularStacks: [
    { id: 'javascript', label: 'JavaScript', ratio: 110 / BAR_AREA },
    { id: 'typescript', label: 'TypeScript', ratio: 104 / BAR_AREA },
    { id: 'react', label: 'React', ratio: 89 / BAR_AREA },
    { id: 'vue', label: 'Vue.js', ratio: 81 / BAR_AREA },
    { id: 'next', label: 'Next.js', ratio: 75 / BAR_AREA },
    { id: 'empty-6', label: '-', ratio: null },
    { id: 'empty-7', label: '-', ratio: null },
    { id: 'empty-8', label: '-', ratio: null },
    { id: 'empty-9', label: '-', ratio: null },
  ],
  companyScale: '스타트업',
  companyRanks: [],
  risingPeriods: RISING_PERIODS,
  selectedRisingPeriod: '한 달',
  // 값이 비면 그래프 대신 '정보가 없습니다.'가 뜨고, 범례는 점 4개 + '-'만 남는다.
  risingAxis: [],
  risingSeries: [
    { id: 'empty-1', label: '-', values: [] },
    { id: 'empty-2', label: '-', values: [] },
    { id: 'empty-3', label: '-', values: [] },
    { id: 'empty-4', label: '-', values: [] },
  ],
}
