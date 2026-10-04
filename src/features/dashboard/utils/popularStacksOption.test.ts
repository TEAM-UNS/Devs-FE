import { describe, expect, it } from 'vitest'
import type { StackBar } from '../types'
import { buildPopularStacksOption } from './popularStacksOption'

// 캔버스로 그려진 결과는 jsdom에서 검증할 수 없다. 그래서 "ECharts에 무엇을 넘겼는가"를
// 확인한다 — 그리는 일 자체는 ECharts의 책임이다.

const BARS: StackBar[] = [
  { id: 'a', label: 'JavaScript', ratio: 110 / 120 },
  { id: 'b', label: 'TypeScript', ratio: 60 / 120 },
  { id: 'c', label: '-', ratio: null },
]

/** series[0]의 data를 꺼낸다 (옵션 타입이 넓어 좁혀서 쓴다) */
function seriesData(option: ReturnType<typeof buildPopularStacksOption>) {
  const series = Array.isArray(option.series) ? option.series[0] : option.series
  return (series?.data ?? []) as {
    value: number
    itemStyle: { color: unknown; borderRadius: number[] }
  }[]
}

describe('buildPopularStacksOption', () => {
  it('모든 항목의 라벨을 x축에 넣는다 (겹쳐도 건너뛰지 않게 interval 0)', () => {
    const option = buildPopularStacksOption(BARS)
    // category 축이라 data가 있지만 옵션 타입은 축 종류의 합집합이라 좁혀서 읽는다
    const xAxis = (
      Array.isArray(option.xAxis) ? option.xAxis[0] : option.xAxis
    ) as {
      data: string[]
      axisLabel: { interval: number }
    }

    expect(xAxis.data).toEqual(['JavaScript', 'TypeScript', '-'])
    expect(xAxis.axisLabel.interval).toBe(0)
  })

  it('막대 높이는 비율 그대로 들어간다 (y축 0~1 기준)', () => {
    const option = buildPopularStacksOption(BARS)
    const yAxis = Array.isArray(option.yAxis) ? option.yAxis[0] : option.yAxis

    expect(yAxis?.min).toBe(0)
    expect(yAxis?.max).toBe(1)
    expect(seriesData(option)[0]?.value).toBeCloseTo(110 / 120, 5)
    expect(seriesData(option)[1]?.value).toBeCloseTo(60 / 120, 5)
  })

  it('비율이 없는 항목은 회색 스텁 막대가 된다', () => {
    const stub = seriesData(buildPopularStacksOption(BARS))[2]

    // 12px / 120px 영역 = 0.1
    expect(stub?.value).toBeCloseTo(0.1, 5)
    expect(stub?.itemStyle.color).toBe('#343a40') // bg-element
  })

  it('데이터가 있는 막대는 Figma 그라디언트를 쓰고, 높이마다 좌표가 다르다', () => {
    const [first, second] = seriesData(buildPopularStacksOption(BARS))
    const gradient = first?.itemStyle.color as { type: string; x: number }

    expect(gradient.type).toBe('linear')
    // CSS 각도를 박스 기준 좌표로 옮기므로 막대 높이가 다르면 좌표도 달라야 한다
    expect(gradient.x).not.toBe((second?.itemStyle.color as { x: number }).x)
  })

  it('막대 위쪽만 둥글다 (Figma radius/xs)', () => {
    expect(
      seriesData(buildPopularStacksOption(BARS))[0]?.itemStyle.borderRadius,
    ).toEqual([2, 2, 0, 0])
  })

  it('왼쪽 막대부터 차례로 올라오도록 지연을 준다', () => {
    const option = buildPopularStacksOption(BARS)
    const series = Array.isArray(option.series)
      ? option.series[0]
      : option.series
    const delay = series?.animationDelay as (index: number) => number

    expect(delay(0)).toBe(0)
    expect(delay(1)).toBeGreaterThan(delay(0))
    expect(delay(2)).toBeGreaterThan(delay(1))
  })
})
