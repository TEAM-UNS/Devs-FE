import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { ReportSubscriptionCard } from './ReportSubscriptionCard'

function renderCard() {
  return render(
    <ReportSubscriptionCard
      defaultMode="fields"
      defaultFields={['프론트엔드']}
    />,
  )
}

const allToggle = () => screen.getByRole('switch', { name: '전체 리포트 구독' })
const fieldToggle = () =>
  screen.getByRole('switch', { name: '분야별 리포트 구독' })

describe('ReportSubscriptionCard', () => {
  it('전체 구독을 켜면 분야별 구독이 꺼진다', async () => {
    const user = userEvent.setup()
    renderCard()

    expect(fieldToggle()).toBeChecked()

    await user.click(allToggle())

    expect(allToggle()).toBeChecked()
    expect(fieldToggle()).not.toBeChecked()
  })

  it('분야별 구독일 때만 분야를 고를 수 있다', async () => {
    const user = userEvent.setup()
    renderCard()

    await user.click(screen.getByRole('button', { name: '모바일' }))
    expect(screen.getByRole('button', { name: '모바일' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )

    // 전체 구독으로 바꾸면 분야 칩은 입력을 받지 않는다
    await user.click(allToggle())
    expect(screen.getByRole('button', { name: '모바일' })).toHaveAttribute(
      'aria-disabled',
      'true',
    )
  })

  it('비활성 상태에서는 키보드로도 분야를 바꿀 수 없다', async () => {
    const user = userEvent.setup()
    renderCard()

    await user.click(allToggle())

    const chip = screen.getByRole('button', { name: '프론트엔드' })
    chip.focus()
    await user.keyboard('{Enter}')

    // 포인터만 막으면 키보드로 빠져나간다
    expect(chip).toHaveAttribute('aria-pressed', 'true')
  })

  it('둘 다 끌 수 있다 — 구독하지 않는 상태다', async () => {
    const user = userEvent.setup()
    renderCard()

    await user.click(fieldToggle())

    expect(allToggle()).not.toBeChecked()
    expect(fieldToggle()).not.toBeChecked()
  })
})
