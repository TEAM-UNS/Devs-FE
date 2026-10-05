import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { FaqSection } from './FaqSection'

describe('FaqSection', () => {
  it('처음에는 모든 질문이 접혀 있다', () => {
    render(<FaqSection />)

    for (const button of screen.getAllByRole('button')) {
      expect(button).toHaveAttribute('aria-expanded', 'false')
    }
  })

  it('질문을 누르면 그 질문만 펼쳐지고 다시 누르면 접힌다', async () => {
    render(<FaqSection />)
    const [first, second] = screen.getAllByRole('button')

    await userEvent.click(first)
    expect(first).toHaveAttribute('aria-expanded', 'true')
    expect(second).toHaveAttribute('aria-expanded', 'false')

    await userEvent.click(first)
    expect(first).toHaveAttribute('aria-expanded', 'false')
  })

  it('접힌 답변은 포커스와 스크린리더에서 빠진다', async () => {
    render(<FaqSection />)
    const [first] = screen.getAllByRole('button')
    const panel = document.getElementById(
      first.getAttribute('aria-controls') ?? '',
    )

    expect(panel).toHaveAttribute('inert')

    await userEvent.click(first)
    expect(panel).not.toHaveAttribute('inert')
  })
})
