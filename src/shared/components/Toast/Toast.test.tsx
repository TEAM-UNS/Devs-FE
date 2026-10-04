import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Toast } from './Toast'

describe('Toast', () => {
  it('타이틀과 설명을 렌더링한다', () => {
    render(<Toast title="작업 완료" description="부가 설명" />)
    expect(screen.getByText('작업 완료')).toBeInTheDocument()
    expect(screen.getByText('부가 설명')).toBeInTheDocument()
  })

  it('error 타입은 role="alert"로 노출된다', () => {
    render(<Toast type="error" title="오류 발생" />)
    expect(screen.getByRole('alert')).toHaveTextContent('오류 발생')
  })

  it('info 타입은 role="status"로 노출된다', () => {
    render(<Toast type="info" title="안내" />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('sm 크기는 설명을 표시하지 않는다', () => {
    render(<Toast size="sm" title="성공" description="숨겨질 설명" />)
    expect(screen.getByText('성공')).toBeInTheDocument()
    expect(screen.queryByText('숨겨질 설명')).not.toBeInTheDocument()
  })
})
