import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Skeleton } from './Skeleton'

describe('Skeleton', () => {
  it('보조 기술에서는 숨기고, 넘긴 크기 클래스를 붙인다', () => {
    const { container } = render(<Skeleton className="h-6 w-32" />)
    const block = container.firstElementChild

    expect(block).toHaveAttribute('aria-hidden', 'true')
    expect(block).toHaveClass('h-6', 'w-32')
  })
})
