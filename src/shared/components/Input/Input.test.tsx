import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Input } from './Input'

describe('Input', () => {
  it('레이블을 입력과 연결해 렌더링한다', () => {
    render(<Input label="닉네임" placeholder="입력" />)
    // label을 통해 접근 가능해야 한다(htmlFor ↔ id 연결)
    expect(screen.getByLabelText('닉네임')).toBeInTheDocument()
  })

  it('입력한 값이 onChange로 전달된다', async () => {
    const onChange = vi.fn()
    render(<Input label="이름" onChange={onChange} />)

    await userEvent.type(screen.getByLabelText('이름'), 'abc')

    expect(onChange).toHaveBeenCalled()
    expect(screen.getByLabelText<HTMLInputElement>('이름').value).toBe('abc')
  })

  it('error 상태에서 aria-invalid와 메시지를 노출한다', () => {
    render(
      <Input label="이메일" state="error" message="형식이 올바르지 않습니다" />,
    )

    const input = screen.getByLabelText('이메일')
    expect(input).toHaveAttribute('aria-invalid', 'true')
    const message = screen.getByText('형식이 올바르지 않습니다')
    expect(message).toBeInTheDocument()
    // 에러 상태에서는 메시지 앞에 에러 아이콘(svg)이 자동으로 붙는다
    expect(message.parentElement?.querySelector('svg')).toBeInTheDocument()
  })

  it('default 상태에서는 메시지 앞 아이콘을 자동으로 붙이지 않는다', () => {
    render(<Input label="이름" message="도움말 문구" />)

    const message = screen.getByText('도움말 문구')
    expect(message.parentElement?.querySelector('svg')).not.toBeInTheDocument()
  })

  it('disabled면 입력이 막힌다', async () => {
    const onChange = vi.fn()
    render(<Input label="비활성" disabled onChange={onChange} />)

    await userEvent.type(screen.getByLabelText('비활성'), 'x')

    expect(onChange).not.toHaveBeenCalled()
  })
})
