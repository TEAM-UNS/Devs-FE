import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { LoginForm } from './LoginForm'

const noop = () => {}

describe('LoginForm', () => {
  it('이메일·비밀번호 필드와 비활성 로그인 버튼을 렌더링한다', () => {
    render(<LoginForm onSubmit={noop} />)

    expect(screen.getByLabelText('이메일')).toBeInTheDocument()
    expect(screen.getByLabelText('비밀번호')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '로그인' })).toBeDisabled()
  })

  it('이메일 형식이 올바르지 않으면 에러 문구를 보여주고 제출을 막는다', async () => {
    render(<LoginForm onSubmit={noop} />)

    await userEvent.type(screen.getByLabelText('이메일'), 'not-an-email')
    await userEvent.type(screen.getByLabelText('비밀번호'), 'pw1234')

    expect(
      await screen.findByText('올바른 이메일 형식이 아니에요'),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '로그인' })).toBeDisabled()
  })

  it('둘 다 채우면 활성화되고 입력값을 onSubmit으로 전달한다', async () => {
    const onSubmit = vi.fn()
    render(<LoginForm onSubmit={onSubmit} />)

    await userEvent.type(screen.getByLabelText('이메일'), 'user@uns.dev')
    await userEvent.type(screen.getByLabelText('비밀번호'), 'pw1234')

    const submit = screen.getByRole('button', { name: '로그인' })
    expect(submit).toBeEnabled()

    await userEvent.click(submit)
    expect(onSubmit).toHaveBeenCalledTimes(1)
    expect(onSubmit.mock.calls[0][0]).toEqual({
      email: 'user@uns.dev',
      password: 'pw1234',
    })
  })

  it('비밀번호 표시 토글이 입력 타입을 바꾼다', async () => {
    render(<LoginForm onSubmit={noop} />)

    const password = screen.getByLabelText('비밀번호')
    expect(password).toHaveAttribute('type', 'password')

    await userEvent.click(screen.getByRole('button', { name: '비밀번호 표시' }))
    expect(password).toHaveAttribute('type', 'text')

    await userEvent.click(
      screen.getByRole('button', { name: '비밀번호 숨기기' }),
    )
    expect(password).toHaveAttribute('type', 'password')
  })
})
