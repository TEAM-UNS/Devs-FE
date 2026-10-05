import { render } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { RisingSeries } from '../../types'
import { RisingStacksCard } from './RisingStacksCard'

const chart = vi.hoisted(() => ({
  setOption: vi.fn(),
  resize: vi.fn(),
  dispose: vi.fn(),
}))
const init = vi.hoisted(() => vi.fn(() => chart))

vi.mock('echarts/core', async (importOriginal) => ({
  ...(await importOriginal<typeof import('echarts/core')>()),
  init,
}))

const PERIODS = ['1주', '한 달'] as const
const NO_SERIES: RisingSeries[] = []
const NO_AXIS: string[] = []

describe('RisingStacksCard', () => {
  beforeEach(() => {
    init.mockClear()
    chart.setOption.mockClear()
  })

  // 로딩 중(빈 시리즈)에 차트 div가 없으면 인스턴스가 안 만들어져
  // 데이터가 와도 그래프가 비어 있었다 (#61)
  it('데이터 없이 마운트돼도 차트를 만들고, 데이터가 오면 그 차트에 그린다', () => {
    const { rerender } = render(
      <RisingStacksCard
        periods={PERIODS}
        selectedPeriod="한 달"
        series={NO_SERIES}
        axisLabels={NO_AXIS}
      />,
    )
    expect(init).toHaveBeenCalledTimes(1)

    const series: RisingSeries[] = [
      { id: 'next', label: 'Next.js', values: [10, 20, 35, 60] },
    ]
    rerender(
      <RisingStacksCard
        periods={PERIODS}
        selectedPeriod="한 달"
        series={series}
        axisLabels={['9/14', '9/21', '9/28', '10/5']}
      />,
    )

    expect(init).toHaveBeenCalledTimes(1)
    expect(chart.setOption).toHaveBeenLastCalledWith(
      expect.objectContaining({ series: expect.any(Array) }),
    )
  })
})
