import { describe, expect, it } from 'vitest'
import type { RisingSeries } from '../types'
import {
  buildRisingStacksOption,
  RISING_SERIES_PALETTE,
  type CursorRef,
} from './risingStacksOption'

// 여기서 검증하는 핵심은 **툴팁이 어느 시리즈를 고르는가**다.
// 캔버스로 그려진 그래프는 jsdom에서 만질 수 없지만, 판정 로직은 순수 함수라 직접 부를 수 있다.

const SERIES: RisingSeries[] = [
  { id: 'a', label: 'Alpha', values: [10, 40] },
  { id: 'b', label: 'Beta', values: [50, 50] },
  { id: 'c', label: 'Gamma', values: [90, 90] },
]
const AXIS = ['1일', '2일']
const MAX = 90 // 시리즈 중 최댓값 — y축 max로 쓰인다
const HEIGHT = 180 // 그래프 박스 높이 → 값 1당 2px

/** ECharts가 axis 트리거에서 넘겨주는 모양 (dataIndex 0 기준) */
const PARAMS_AT_INDEX_0 = SERIES.map((series, seriesIndex) => ({
  seriesIndex,
  seriesName: series.label,
  name: AXIS[0],
  value: series.values[0],
}))

/** 커서를 특정 "값" 높이에 놓고 툴팁 HTML을 받는다 */
function tooltipAt(value: number, xRatio = 0) {
  const cursor: CursorRef = {
    current: { xRatio, yRatio: 1 - value / MAX, height: HEIGHT },
  }
  const option = buildRisingStacksOption(SERIES, AXIS, cursor)
  const tooltip = Array.isArray(option.tooltip)
    ? option.tooltip[0]
    : option.tooltip
  const formatter = tooltip?.formatter as (params: unknown) => string

  return formatter(PARAMS_AT_INDEX_0)
}

const nameIn = (html: string) =>
  html.match(/uns-chart-tooltip__name">([^<]*)</)?.[1] ?? null

describe('buildRisingStacksOption — 툴팁 시리즈 판정', () => {
  it('곡선 바로 위에 커서가 있으면 그 시리즈를 고른다', () => {
    expect(nameIn(tooltipAt(90))).toBe('Gamma')
    expect(nameIn(tooltipAt(50))).toBe('Beta')
    expect(nameIn(tooltipAt(10))).toBe('Alpha')
  })

  it('곡선 사이 빈 띠에서는 바로 위쪽 곡선을 고른다', () => {
    // 30은 Alpha(10)와 Beta(50) 사이 — 위쪽 경계인 Beta가 그 띠의 주인이다
    expect(nameIn(tooltipAt(30))).toBe('Beta')
    // 70은 Beta(50)와 Gamma(90) 사이
    expect(nameIn(tooltipAt(70))).toBe('Gamma')
  })

  it('가장 낮은 곡선 아래(바닥 쪽)에서는 가장 낮은 곡선을 고른다', () => {
    expect(nameIn(tooltipAt(2))).toBe('Alpha')
  })

  it('모든 곡선 위(그래프가 없는 빈 곳)에서는 툴팁을 띄우지 않는다', () => {
    // Gamma(90)보다 충분히 위 → 아무것도 안 뜬다
    expect(tooltipAt(90 + 20 / 2)).toBe('')
  })

  it('커서 x 위치에 따라 곡선 값을 보간해 판정한다', () => {
    // params는 dataIndex 0(Alpha=10) 값을 담고 있지만,
    // 커서가 오른쪽 끝이면 Alpha는 40으로 보간돼야 한다.
    // 값 38에서: 보간을 안 하면 Alpha(10)가 멀어 Beta가 뽑히고,
    // 보간을 하면 Alpha(40)가 바로 위라 Alpha가 뽑힌다.
    expect(nameIn(tooltipAt(38, 0))).toBe('Beta')
    expect(nameIn(tooltipAt(38, 1))).toBe('Alpha')
  })

  it('시안대로 시리즈를 하나만 보여준다', () => {
    const html = tooltipAt(30)
    expect(html.match(/uns-chart-tooltip__row/g)).toHaveLength(1)
  })

  it('커서 정보가 없으면 첫 시리즈로 떨어진다', () => {
    const option = buildRisingStacksOption(SERIES, AXIS, { current: null })
    const tooltip = Array.isArray(option.tooltip)
      ? option.tooltip[0]
      : option.tooltip
    const formatter = tooltip?.formatter as (params: unknown) => string

    expect(nameIn(formatter(PARAMS_AT_INDEX_0))).toBe('Alpha')
  })
})

describe('buildRisingStacksOption — 시리즈 구성', () => {
  it('범례 색과 그래프 색이 같은 팔레트에서 순서대로 나온다', () => {
    const option = buildRisingStacksOption(SERIES, AXIS, { current: null })
    const series = Array.isArray(option.series)
      ? option.series
      : [option.series]

    series.forEach((item, index) => {
      // 옵션 타입이 bar|line 합집합이라 line 전용 필드는 좁혀서 읽는다
      const { lineStyle } = item as unknown as { lineStyle: { color: string } }
      expect(lineStyle.color).toBe(RISING_SERIES_PALETTE[index].hex)
    })
  })

  it('겹친 영역이 밝아지도록 screen 블렌드를 쓴다 (Figma 288:987)', () => {
    const option = buildRisingStacksOption(SERIES, AXIS, { current: null })
    const series = Array.isArray(option.series)
      ? option.series
      : [option.series]

    for (const item of series) {
      expect(item?.blendMode).toBe('screen')
    }
  })

  it('y축 최댓값을 데이터 최댓값으로 고정한다 (커서 위치를 값으로 되돌리기 위해)', () => {
    const option = buildRisingStacksOption(SERIES, AXIS, { current: null })
    const yAxis = Array.isArray(option.yAxis) ? option.yAxis[0] : option.yAxis

    expect(yAxis?.max).toBe(MAX)
  })
})
