import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Textarea } from './Textarea'

describe('Textarea', () => {
  it('레이블을 입력과 연결해 렌더링한다', () => {
    render(<Textarea label="자기소개" placeholder="입력" />)
    expect(screen.getByLabelText('자기소개')).toBeInTheDocument()
  })

  it('입력한 값이 onChange로 전달된다', async () => {
    const onChange = vi.fn()
    render(<Textarea label="내용" onChange={onChange} />)

    await userEvent.type(screen.getByLabelText('내용'), 'hello')

    expect(onChange).toHaveBeenCalled()
    expect(screen.getByLabelText<HTMLTextAreaElement>('내용').value).toBe(
      'hello',
    )
  })

  it('error 상태에서 aria-invalid와 메시지를 노출한다', () => {
    render(<Textarea label="사유" state="error" message="필수 항목입니다" />)

    const field = screen.getByLabelText('사유')
    expect(field).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByText('필수 항목입니다')).toBeInTheDocument()
  })

  it('disabled면 입력이 막힌다', async () => {
    const onChange = vi.fn()
    render(<Textarea label="비활성" disabled onChange={onChange} />)

    await userEvent.type(screen.getByLabelText('비활성'), 'x')

    expect(onChange).not.toHaveBeenCalled()
  })
})
