import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { useToastStore } from '@/shared/stores/useToastStore'
import { CareerGoalCard } from './CareerGoalCard'

const GOALS = [{ id: 'job', label: '목표직무', value: 'Frontend' }]

describe('CareerGoalCard', () => {
  it('수정 버튼을 누르면 아직 제공되지 않는 기능이라고 안내한다', async () => {
    const show = vi.fn()
    useToastStore.setState({ show })
    render(<CareerGoalCard goals={GOALS} />)

    await userEvent.click(screen.getByRole('button', { name: '목표직무 수정' }))

    expect(show).toHaveBeenCalledWith({
      type: 'info',
      title: '아직 제공되지 않는 기능입니다',
    })
  })
})
