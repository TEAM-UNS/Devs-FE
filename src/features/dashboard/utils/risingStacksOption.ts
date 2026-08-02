import type { TooltipComponentOption } from 'echarts/components'
import type { DashboardChartOption } from '../hooks/useEChart'
import type { RisingSeries } from '../types'

/**
 * 시리즈 색 — Figma 288:987의 영역 그라디언트 시작색이자 범례 점 색이다.
 *
 * 그래프는 캔버스라 CSS를 상속하지 못해 hex가 필요하고, 범례 점은 DOM이라 Tailwind
 * 클래스가 필요하다. 둘을 따로 두면 순서가 어긋나 범례와 그래프 색이 뒤바뀔 수 있어
 * 한 배열에 쌍으로 묶는다. (hex는 index.css `@theme`의 --color-chart-* 렌더 값)
 */
export const RISING_SERIES_PALETTE = [
  { hex: '#f0f671', dotClass: 'bg-chart-yellow' },
  { hex: '#12e1f9', dotClass: 'bg-chart-cyan' },
  { hex: '#508aff', dotClass: 'bg-chart-blue' },
  { hex: '#28f3a5', dotClass: 'bg-chart-mint' },
] as const

// Figma 288:987 — 각 영역은 시리즈 색에서 투명으로 떨어지는 세로 그라디언트에
// fill-opacity 0.55가 곱해지고, 겹치는 부분은 mix-blend-mode: screen으로 합성된다.
const AREA_OPACITY = 0.55

/** 툴팁 배경 (Figma 290:1000 = gray-200). 꼬리 색과 반드시 같아야 한다 — index.css 참고 */
const TOOLTIP_BG = '#495057'

/** 툴팁 아래 꼬리 높이 (Figma 290:1002). index.css의 ::after 값과 같아야 한다 */
const ARROW_HEIGHT = 10.5

const ANIMATION_DURATION = 400
const ANIMATION_EASING = 'cubicOut'

function prefersReducedMotion() {
  return (
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
  )
}

/**
 * 시리즈 색에서 투명으로 떨어지는 세로 그라디언트 (Figma의 linearGradient 그대로).
 * 끝 색은 `transparent`(= 검정 알파 0)가 아니라 **같은 색의 알파 0**이어야 한다.
 * Figma도 `stop-opacity="0"`을 쓴다 — 검정으로 떨어지면 아래쪽에 어두운 테두리가 남는다.
 */
function areaGradient(color: string) {
  return {
    type: 'linear' as const,
    x: 0,
    y: 0,
    x2: 0,
    y2: 1,
    colorStops: [
      { offset: 0, color },
      { offset: 1, color: `${color}00` }, // 8자리 hex의 뒤 2자리가 알파
    ],
  }
}

/** 그래프 박스 안 커서 위치. 비율(0~1)과 박스 높이를 함께 담는다. 밖이면 null. */
export interface CursorRef {
  current: { xRatio: number; yRatio: number; height: number } | null
}

/**
 * 곡선을 정확히 가리켰다고 볼 거리(px). 이 안이면 영역 판정보다 곡선을 우선한다.
 * 선 두께(1px)보다는 넉넉해야 집을 수 있지만, 넓으면 곡선이 가까울 때 스냅 영역이
 * 서로 겹쳐 판정이 흔들린다(10px일 때 0.5px 차이로 뒤집히는 지점이 있었다).
 */
const CURVE_SNAP_PX = 6

/**
 * 커서 x에서의 곡선 값. ECharts는 x축을 데이터 지점으로 스냅하지만, 그 지점 값만 쓰면
 * 지점 사이에서 판정이 뭉툭해진다. 이웃 두 값을 선형 보간해 커서 바로 아래 곡선 높이를 쓴다.
 * (실제 곡선은 smooth 스플라인이라 근사지만, 스냅된 값보다 훨씬 가깝다)
 */
function valueAtRatio(
  values: readonly number[],
  xRatio: number,
): number | null {
  if (values.length === 0) return null
  if (values.length === 1) return values[0]

  const position = Math.min(Math.max(xRatio, 0), 1) * (values.length - 1)
  const index = Math.min(Math.floor(position), values.length - 2)
  const weight = position - index

  return values[index] + (values[index + 1] - values[index]) * weight
}

/** ECharts가 axis 트리거로 넘겨주는 항목 중 우리가 읽는 부분만. */
interface AxisPoint {
  seriesIndex?: number
  seriesName?: string
  name?: string
  value?: unknown
}

/**
 * 커서가 가리키는 시리즈 하나를 고른다. 그래프가 없는 빈 곳이면 null.
 *
 * 1. 어떤 곡선에 충분히 가까우면(CURVE_SNAP_PX) 그 곡선 — 선을 집으려는 의도로 본다.
 * 2. 아니면 **커서가 들어 있는 띠의 주인** — 커서보다 위에 있는 가장 낮은 곡선.
 *    영역은 바닥부터 곡선까지 칠해지므로, 그 띠의 위쪽 경계가 색을 결정한다.
 * 3. 커서보다 위에 아무 곡선도 없으면 아무것도 안 칠해진 빈 곳이다.
 */
function pickHoveredPoint(
  points: AxisPoint[],
  cursor: NonNullable<CursorRef['current']>,
  maxValue: number,
  series: readonly RisingSeries[],
): AxisPoint | null {
  const cursorValue = (1 - cursor.yRatio) * maxValue
  const pxPerValue = cursor.height / maxValue

  const curves = points.map((point) => {
    const values = series[point.seriesIndex ?? 0]?.values ?? []
    const curveValue =
      valueAtRatio(values, cursor.xRatio) ?? Number(point.value)

    return {
      point,
      curveValue,
      distancePx: Math.abs(curveValue - cursorValue) * pxPerValue,
    }
  })

  const nearest = [...curves].sort((a, b) => a.distancePx - b.distancePx)[0]
  if (nearest && nearest.distancePx <= CURVE_SNAP_PX) return nearest.point

  const above = curves
    .filter((curve) => curve.curveValue >= cursorValue)
    .sort((a, b) => a.curveValue - b.curveValue)

  return above[0]?.point ?? null
}

/**
 * 툴팁 내용 — Figma 290:1004 (점 + 시리즈명 + 시점).
 * ECharts가 만드는 DOM이라 Tailwind 유틸리티를 붙일 수 없어, 클래스만 지정하고
 * 실제 스타일은 index.css의 `.uns-chart-tooltip` 규칙에서 정의한다.
 *
 * trigger가 'axis'라 그 시점의 시리즈가 전부 넘어오지만, 시안처럼 **하나만** 보여준다.
 * ('item' 트리거를 쓸 수 없어서다 — 데이터 점이 없는 라인/영역은 hover 대상이 없다)
 */
function createTooltipFormatter(
  cursor: CursorRef,
  maxValue: number,
  series: readonly RisingSeries[],
): TooltipComponentOption['formatter'] {
  return (params) => {
    const points: AxisPoint[] = Array.isArray(params) ? params : [params]
    const at = cursor.current

    const point =
      at && maxValue > 0
        ? pickHoveredPoint(points, at, maxValue, series)
        : points[0]

    if (!point) return ''

    // 색은 params.color 대신 팔레트에서 꺼낸다 — 시리즈 색이 그라디언트라 params.color가
    // 문자열이 아닐 수 있고, 범례와 같은 출처를 쓰는 편이 어긋날 여지도 없다.
    const { hex } =
      RISING_SERIES_PALETTE[
        (point.seriesIndex ?? 0) % RISING_SERIES_PALETTE.length
      ]
    const dot = `<span class="uns-chart-tooltip__dot" style="background:${hex}"></span>`
    const name = `<span class="uns-chart-tooltip__name">${point.seriesName ?? ''}</span>`
    const date = `<span class="uns-chart-tooltip__date">${point.name ?? ''}</span>`

    return `<span class="uns-chart-tooltip__row">${dot}${name}</span>${date}`
  }
}

/**
 * 툴팁을 **커서 지점 그대로** 놓는다. 가운데 정렬과 꼬리만큼의 offset은 CSS transform이
 * 자기 크기 기준으로 처리한다(index.css).
 *
 * 여기서 크기를 재지 않는 이유: `size.contentSize`도, `dom.offsetWidth`도 이 시점엔
 * **직전 내용** 기준이라 시리즈 이름 길이가 바뀌면 가로 중앙이 최대 13px 어긋났다.
 * transform은 브라우저가 최종 크기로 계산하므로 그 문제가 없다.
 *
 * 높이는 항상 두 줄(이름 + 날짜)로 일정해서, 위로 뒤집을지 판단할 때만 contentSize를 쓴다.
 */
const tooltipPosition: TooltipComponentOption['position'] = (
  point,
  _params,
  dom,
  _rect,
  size,
) => {
  const cursorY = point[1]
  const noRoomAbove = cursorY - size.contentSize[1] - ARROW_HEIGHT < 0
  const element = dom as HTMLElement

  element.classList.toggle('uns-chart-tooltip--below', noRoomAbove)

  return point
}

/**
 * 급상승 기술 스택 영역 그래프 옵션.
 * 축·눈금 없이 영역만 그리고, 겹침은 screen 블렌드로 합성한다(Figma 288:987).
 *
 * @param axisLabels 시점 라벨. 축엔 안 보이고 툴팁에만 쓰인다
 * @param cursor 툴팁이 시리즈 하나를 고르는 데 쓰는 커서 위치
 */
export function buildRisingStacksOption(
  series: readonly RisingSeries[],
  axisLabels: readonly string[],
  cursor: CursorRef,
): DashboardChartOption {
  const animate = !prefersReducedMotion()
  const pointCount = Math.max(...series.map((s) => s.values.length), 0)
  // y축 최댓값을 명시해야 커서 위치(0~1)를 값으로 되돌릴 수 있다. 자동이면 축 범위를 모른다.
  const maxValue = Math.max(...series.flatMap(({ values }) => [...values]), 0)

  return {
    animation: animate,
    animationDuration: ANIMATION_DURATION,
    animationEasing: ANIMATION_EASING,
    // 축을 숨기고 영역이 박스를 꽉 채우게 한다 (Figma엔 축·격자가 없다)
    grid: { left: 0, right: 0, top: 0, bottom: 0 },
    tooltip: {
      // 'item'은 쓸 수 없다: symbol이 없는 라인/영역 시리즈는 hover 대상이 없어
      // 툴팁이 아예 뜨지 않는다. 마우스 x 위치로 잡는 'axis'라야 주석("마우스에 따라
      // 툴팁이 나타납니다")대로 동작한다. 대신 그 시점의 시리즈가 전부 넘어온다.
      trigger: 'axis',
      position: tooltipPosition,
      // confine을 켜면 안 된다: ECharts가 **CSS translate가 적용되기 전** 좌표로
      // 경계를 계산해, 아래쪽 곡선을 가리켰을 때 툴팁이 최대 35px 위로 밀린다.
      // 툴팁이 그래프 박스를 조금 벗어나는 편이 자연스럽고, 카드가 자르지도 않는다.
      confine: false,
      // ECharts는 배경·패딩·radius를 **인라인 스타일**로 넣어 CSS 클래스를 덮어쓴다.
      // 그래서 박스는 여기서 지정하고, CSS 클래스는 꼬리(::after)와 글자만 담당한다.
      backgroundColor: TOOLTIP_BG,
      borderWidth: 0,
      padding: [4, 12], // Figma 290:1000
      // transitionDuration 0: ECharts가 left/top을 애니메이션하면 CSS transform과
      // 겹쳐 툴팁이 커서를 늦게 따라온다.
      transitionDuration: 0,
      extraCssText: 'border-radius:6px;box-shadow:none;',
      className: 'uns-chart-tooltip',
      formatter: createTooltipFormatter(cursor, maxValue, series),
      // 세로 지시선은 Figma에 없다
      axisPointer: { type: 'none' },
    },
    xAxis: {
      type: 'category',
      show: false,
      boundaryGap: false, // 첫·마지막 점이 박스 좌우 끝에 붙는다
      data: axisLabels.slice(0, pointCount),
    },
    yAxis: { type: 'value', show: false, min: 0, max: maxValue },
    series: series.map(({ id, label, values }, index) => {
      const { hex: color } =
        RISING_SERIES_PALETTE[index % RISING_SERIES_PALETTE.length]

      return {
        id,
        name: label,
        type: 'line' as const,
        smooth: true,
        symbol: 'none' as const, // Figma엔 데이터 점 표시가 없다
        lineStyle: { color, width: 1 },
        areaStyle: {
          color: areaGradient(color),
          opacity: AREA_OPACITY,
        },
        // 겹친 영역이 밝아지는 Figma의 합성 방식
        blendMode: 'screen' as const,
        data: [...values],
      }
    }),
  }
}
