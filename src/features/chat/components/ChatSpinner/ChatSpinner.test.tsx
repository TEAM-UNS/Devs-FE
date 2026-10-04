import { act, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ChatSpinner } from './ChatSpinner'

describe('ChatSpinner', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('advances to the next Figma frame every 120ms', () => {
    vi.useFakeTimers()
    render(<ChatSpinner />)

    const image = screen
      .getByRole('status', {
        name: '답변 생성 중',
      })
      .querySelector('img')
    const initialFrame = image?.getAttribute('src')

    act(() => vi.advanceTimersByTime(119))
    expect(image).toHaveAttribute('src', initialFrame)

    act(() => vi.advanceTimersByTime(1))
    expect(image).not.toHaveAttribute('src', initialFrame)
  })
})
