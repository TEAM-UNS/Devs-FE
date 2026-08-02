import type { DashboardChartOption } from '../hooks/useEChart'
import type { StackBar } from '../types'

/**
 * 차트 색 — index.css `@theme` 토큰의 렌더 값을 그대로 옮긴 것.
 * 캔버스는 CSS를 상속하지 않아 값을 직접 넘겨야 한다(토큰이 바뀌면 여기도 같이 고친다).
 */
const COLOR = {
  primary700: '#e1c4fb',
  primary600: '#ce9af7',
  primary400: '#aa5ef1',
  /** Figma 마지막 stop이 115.48%(선 밖)이라, 100% 지점 색을 sRGB 보간해 구한 값 */
  gradientEnd: '#8737cf',
  /** 데이터 없는 막대 (bg-element) */
  stub: '#343a40',
  /** 축 라벨 (gray-400) */
  label: '#adb5bd',
} as const

// Figma 279:846 기준 치수.
const BAR_AREA_HEIGHT = 120
const BAR_WIDTH = 40
const STUB_HEIGHT = 12
const GRID_SIDE = 33 // (1056 - 990) / 2 — 막대 열이 카드 안에서 가운데 정렬된다
const LABEL_MARGIN = 6

// Figma 279:840의 그라디언트 각도. CSS 각도는 0deg=위, 시계방향.
const GRADIENT_DEG = 214.46429599579724
const RAD = (GRADIENT_DEG * Math.PI) / 180
const SIN = Math.sin(RAD)
const COS = Math.cos(RAD)

// 모션 토큰(--duration-slow / --ease-decelerate)에 맞춘 값.
const ANIMATION_DURATION = 400
const ANIMATION_EASING = 'cubicOut'

// 막대마다 시작을 조금씩 늦춰 왼쪽에서 오른쪽으로 차례로 올라오게 한다.
// (Figma 274:1871 주석 "왼쪽->오른쪽 상승하는 애니메이션"의 결)
const ANIMATION_STAGGER = 45

/**
 * CSS `linear-gradient(θ, …)`를 ECharts 정규화 좌표로 옮긴다.
 *
 * CSS는 그라디언트 선이 박스 중심을 지나고 길이가 |w·sinθ| + |h·cosθ|인데,
 * ECharts는 박스 기준 0~1 좌표라 **박스 비율이 바뀌면 좌표도 바뀐다.**
 * 막대마다 높이가 달라서 하나의 값으로 고정할 수 없어 높이별로 계산한다.
 */
function gradientFor(height: number) {
  // 그라디언트 선의 길이(CSS 규칙) → 중심에서 양 끝까지의 거리를 박스 비율로 환산
  const lineLength = Math.abs(BAR_WIDTH * SIN) + Math.abs(height * COS)
  const dx = (SIN * lineLength) / (2 * BAR_WIDTH)
  const dy = (-COS * lineLength) / (2 * height)

  return {
    type: 'linear' as const,
    x: 0.5 - dx,
    y: 0.5 - dy,
    x2: 0.5 + dx,
    y2: 0.5 + dy,
    colorStops: [
      { offset: 0.02247, color: COLOR.primary700 },
      { offset: 0.15299, color: COLOR.primary600 },
      { offset: 0.65672, color: COLOR.primary400 },
      { offset: 1, color: COLOR.gradientEnd },
    ],
  }
}

/** 사용자가 모션 최소화를 켰으면 애니메이션을 끈다 (캔버스엔 motion-reduce 유틸리티가 안 먹는다). */
function prefersReducedMotion() {
  return (
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
  )
}

/**
 * 인기 기술 스택 세로 막대 그래프 옵션.
 * 비율이 없는 항목은 회색 스텁 막대(12px)로, 라벨은 데이터에 담긴 '-'로 나온다.
 */
export function buildPopularStacksOption(
  bars: readonly StackBar[],
): DashboardChartOption {
  const animate = !prefersReducedMotion()

  return {
    animation: animate,
    animationDuration: ANIMATION_DURATION,
    animationEasing: ANIMATION_EASING,
    grid: {
      left: GRID_SIDE,
      right: GRID_SIDE,
      top: 16,
      // 라벨 높이(18) + 막대와의 간격(6)
      bottom: 24,
    },
    xAxis: {
      type: 'category',
      data: bars.map((bar) => bar.label),
      axisLine: { show: false }, // Figma엔 축선·눈금이 없다
      axisTick: { show: false },
      axisLabel: {
        color: COLOR.label,
        fontSize: 12,
        // 캔버스 텍스트는 CSS 폰트를 상속하지 않아 직접 지정해야 한다.
        fontFamily: 'Pretendard Variable, Pretendard, sans-serif',
        margin: LABEL_MARGIN,
        interval: 0, // 9개를 전부 보여준다 (기본값은 겹치면 건너뛴다)
      },
    },
    yAxis: {
      type: 'value',
      show: false,
      min: 0,
      max: 1, // ratio가 0~1이라 막대 높이 = ratio × 120px이 된다
    },
    series: [
      {
        type: 'bar',
        barWidth: BAR_WIDTH,
        // ECharts는 막대에 기본으로 pointer 커서를 준다. 이 막대는 누를 수 있는 게
        // 아니라서 클릭 가능한 것처럼 오해된다 → 기본 커서로 되돌린다.
        cursor: 'default',
        // 진입 시 바닥에서 위로 자란다. 왼쪽 막대부터 차례로 시작한다.
        animationDelay: (dataIndex: number) => dataIndex * ANIMATION_STAGGER,
        data: bars.map(({ ratio }) => {
          const isStub = ratio === null
          const height = isStub ? STUB_HEIGHT : ratio * BAR_AREA_HEIGHT

          return {
            value: height / BAR_AREA_HEIGHT,
            itemStyle: {
              borderRadius: [2, 2, 0, 0], // 위쪽만 radius/xs
              color: isStub ? COLOR.stub : gradientFor(height),
            },
          }
        }),
      },
    ],
  }
}
