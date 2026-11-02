import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it } from 'vitest'
import { WeekWheel } from './WeekWheel'

function Controlled({ initial = 1 }: { initial?: number }) {
  const [weeks, setWeeks] = useState(initial)
  return <WeekWheel weeks={weeks} onChange={setWeeks} />
}

const value = () => screen.getByRole('spinbutton', { name: '로드맵 기간' })

describe('WeekWheel', () => {
  it('버튼으로 한 주씩 바꾸고 끝에서는 막는다', async () => {
    render(<Controlled initial={1} />)

    expect(screen.getByRole('button', { name: '한 주 줄이기' })).toBeDisabled()
    await userEvent.click(screen.getByRole('button', { name: '한 주 늘리기' }))
    expect(value()).toHaveAttribute('aria-valuenow', '2')
  })

  it('키보드 위아래·Home·End로 바꾼다', async () => {
    render(<Controlled initial={4} />)

    value().focus()
    await userEvent.keyboard('{ArrowUp}')
    expect(value()).toHaveAttribute('aria-valuenow', '5')
    await userEvent.keyboard('{End}')
    expect(value()).toHaveAttribute('aria-valuenow', '12')
    await userEvent.keyboard('{ArrowUp}')
    expect(value()).toHaveAttribute('aria-valuenow', '12')
    await userEvent.keyboard('{Home}')
    expect(value()).toHaveAttribute('aria-valuenow', '1')
  })

  it('휠은 한 칸(100)마다 한 주, 덜 굴리면 쌓였다가 넘어간다', () => {
    render(<Controlled initial={4} />)

    fireEvent.wheel(value(), { deltaY: 100 })
    expect(value()).toHaveAttribute('aria-valuenow', '5')
    fireEvent.wheel(value(), { deltaY: -60 })
    expect(value()).toHaveAttribute('aria-valuenow', '5')
    fireEvent.wheel(value(), { deltaY: -60 })
    expect(value()).toHaveAttribute('aria-valuenow', '4')
  })
})
