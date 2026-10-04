import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Toggle } from './Toggle'

describe('Toggle', () => {
  it('switch 역할과 라벨을 가지며 눌러서 켜고 끌 수 있다', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Toggle label="전체 리포트 구독" onChange={onChange} />)

    const toggle = screen.getByRole('switch', { name: '전체 리포트 구독' })
    expect(toggle).not.toBeChecked()

    await user.click(toggle)
    expect(onChange).toHaveBeenCalled()
  })

  it('비활성이면 눌러도 바뀌지 않는다', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Toggle label="분야별 리포트 구독" disabled onChange={onChange} />)

    await user.click(screen.getByRole('switch', { name: '분야별 리포트 구독' }))

    expect(onChange).not.toHaveBeenCalled()
    expect(screen.getByRole('switch')).toBeDisabled()
  })
})
