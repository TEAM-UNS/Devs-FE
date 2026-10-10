import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ChatMarkdown } from './ChatMarkdown'

describe('ChatMarkdown', () => {
  it('굵게·목록·표를 태그로 그린다', () => {
    const { container } = render(
      <ChatMarkdown
        content={
          '**TypeScript**가 1위입니다\n\n1. React\n2. Vue\n\n| 기술 | 공고 |\n| --- | --- |\n| React | 42 |'
        }
      />,
    )

    expect(screen.getByText('TypeScript').tagName).toBe('STRONG')
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
    expect(screen.getByRole('table')).toBeInTheDocument()
    // 기호가 그대로 보이지 않는다
    expect(container).not.toHaveTextContent('**')
  })

  /* 답변 재료가 채용공고 원문이라 섞여 온 HTML이 그려지면 스크립트가 실행될 수 있다 */
  it('답변에 섞인 HTML 태그는 그리지 않는다', () => {
    const { container } = render(
      <ChatMarkdown content={'<img src=x onerror="alert(1)"> 텍스트'} />,
    )

    expect(container.querySelector('img')).toBeNull()
  })

  it('javascript: 링크는 주소를 지운다', () => {
    render(<ChatMarkdown content={'[눌러 보세요](javascript:alert(1))'} />)

    expect(
      screen.getByText('눌러 보세요').closest('a')?.getAttribute('href') ?? '',
    ).not.toContain('javascript')
  })

  it('링크는 새 탭으로 열고 열린 페이지가 이 창에 접근하지 못하게 한다', () => {
    render(<ChatMarkdown content={'[공고 보기](https://example.com/job/1)'} />)

    const link = screen.getByRole('link', { name: '공고 보기' })
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })
})
