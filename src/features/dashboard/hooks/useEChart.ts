import type { BarSeriesOption, LineSeriesOption } from 'echarts/charts'
import { BarChart, LineChart } from 'echarts/charts'
import type {
  GridComponentOption,
  TooltipComponentOption,
} from 'echarts/components'
import { GridComponent, TooltipComponent } from 'echarts/components'
import type { ComposeOption, ECharts } from 'echarts/core'
// `use`를 그대로 쓰면 React 19의 use() 훅과 이름이 겹쳐 rules-of-hooks가 에러를 낸다.
import { init, use as registerECharts } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { useEffect, useRef } from 'react'

/**
 * ── tree-shaking 진입점 ──
 * `import * as echarts from 'echarts'`(전체)를 쓰면 안 쓰는 차트까지 전부 번들에 들어간다.
 * 필요한 것만 여기서 등록하고, 대시보드는 이 훅으로만 ECharts에 접근한다.
 * (차트를 쓰는 feature가 하나 더 생기면 이 파일을 shared로 올린다.)
 *
 * 렌더러는 canvas만 등록한다 — SVG 렌더러는 `blendMode: 'screen'`을 출력에 반영하지
 * 않아 급상승 그래프의 겹침 표현(Figma 288:987)이 사라진다. 측정 근거는
 * docs/perf/echarts-renderer.md 참고.
 */
registerECharts([
  BarChart,
  LineChart,
  GridComponent,
  TooltipComponent,
  CanvasRenderer,
])

/** 이 화면에서 쓰는 옵션만 합성한 타입. 등록하지 않은 차트의 옵션은 타입 단계에서 막힌다. */
export type DashboardChartOption = ComposeOption<
  | BarSeriesOption
  | LineSeriesOption
  | GridComponentOption
  | TooltipComponentOption
>

/**
 * ECharts 인스턴스의 생성·갱신·리사이즈·정리를 담당한다.
 * 반환된 ref를 크기가 정해진 컨테이너에 걸어 쓴다.
 */
export function useEChart(option: DashboardChartOption) {
  const containerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<ECharts | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const chart = init(container)
    chartRef.current = chart

    // 캔버스는 CSS처럼 자동으로 늘어나지 않는다. 컨테이너 크기를 직접 감시해 다시 그린다.
    //
    // ⚠️ ResizeObserver는 observe() 직후 **초기 크기로 한 번 즉시 발화**한다. 그때
    // 그냥 resize()를 부르면 방금 시작한 진입 애니메이션이 최종값으로 끊긴다
    // (막대가 아래에서 올라오지 않고 그냥 나타난다). 그래서 크기가 실제로 달라졌을
    // 때만 다시 그린다.
    let lastWidth = container.clientWidth
    let lastHeight = container.clientHeight

    const observer = new ResizeObserver(() => {
      const { clientWidth, clientHeight } = container
      if (clientWidth === lastWidth && clientHeight === lastHeight) return

      lastWidth = clientWidth
      lastHeight = clientHeight
      chart.resize()
    })
    observer.observe(container)

    return () => {
      observer.disconnect()
      // dispose를 안 하면 DOM이 사라져도 인스턴스와 이벤트 리스너가 남는다.
      chart.dispose()
      chartRef.current = null
    }
  }, [])

  useEffect(() => {
    // notMerge를 쓰지 않는다: 기본 병합이라야 필터가 바뀔 때 막대가 새 값으로
    // 애니메이션되며 이동한다. notMerge면 매번 처음부터 다시 그려져 전환이 끊긴다.
    chartRef.current?.setOption(option)
  }, [option])

  return containerRef
}
