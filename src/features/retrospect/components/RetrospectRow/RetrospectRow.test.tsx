import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { Retrospect } from '../../types'
import { RetrospectRow } from './RetrospectRow'

const retrospect: Retrospect = {
  retrospectId: 1,
  dayNo: 3,
  content: '회고',
  date: '2026-10-26',
  likeCount: 0,
  liked: false,
}

describe('RetrospectRow', () => {
  it('반복해 놓은 카드도 누르면 상세를 연다', () => {
    const onOpen = vi.fn()
    const { container } = render(
      <RetrospectRow
        retrospects={[retrospect]}
        direction="right"
        offset={0}
        onOpen={onOpen}
      />,
    )

    const buttons = container.querySelectorAll<HTMLButtonElement>(
      'button[aria-label$="회고 보기"]',
    )
    fireEvent.click(buttons[buttons.length - 1])

    expect(onOpen).toHaveBeenCalledWith(retrospect)
  })

  it('스크린리더·Tab에는 원본 한 장만 드러난다', () => {
    render(
      <RetrospectRow
        retrospects={[retrospect]}
        direction="right"
        offset={0}
        onOpen={vi.fn()}
      />,
    )

    expect(screen.getAllByRole('button', { name: /회고 보기$/ })).toHaveLength(
      1,
    )
    expect(screen.getAllByRole('article')).toHaveLength(1)
  })
})
