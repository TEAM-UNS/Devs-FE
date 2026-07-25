import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { SignupStep1 } from './SignupStep1'

const noop = () => {}

describe('SignupStep1', () => {
  it('이메일·인증코드 입력과 인증·다음 버튼을 렌더링한다', () => {
    render(<SignupStep1 onNext={noop} />)

    expect(screen.getByLabelText('이메일')).toBeInTheDocument()
    expect(screen.getByLabelText('이메일 인증')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: '이메일 인증' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /다음/ })).toBeInTheDocument()
  })

  it('올바른 이메일을 입력하기 전에는 인증 버튼이 비활성이다', async () => {
    render(<SignupStep1 onNext={noop} />)

    const verifyButton = screen.getByRole('button', { name: '이메일 인증' })
    expect(verifyButton).toBeDisabled()

    await userEvent.type(screen.getByLabelText('이메일'), 'not-an-email')
    expect(verifyButton).toBeDisabled()

    await userEvent.clear(screen.getByLabelText('이메일'))
    await userEvent.type(screen.getByLabelText('이메일'), 'user@uns.dev')
    expect(verifyButton).toBeEnabled()
  })

  it('인증 요청 전에는 코드 입력이 막혀 있다', () => {
    render(<SignupStep1 onNext={noop} />)

    expect(screen.getByLabelText('이메일 인증')).toBeDisabled()
  })

  it('인증 버튼을 누르면 코드 입력이 열리고 타이머(5:00)가 뜬다', async () => {
    render(<SignupStep1 onNext={noop} />)

    await userEvent.type(screen.getByLabelText('이메일'), 'user@uns.dev')
    await userEvent.click(screen.getByRole('button', { name: '이메일 인증' }))

    expect(screen.getByLabelText('이메일 인증')).toBeEnabled()
    expect(screen.getByText('5:00')).toBeInTheDocument()
  })

  it('이메일·코드가 모두 유효해야 다음 버튼이 활성화되고 onNext로 값이 전달된다', async () => {
    const onNext = vi.fn()
    render(<SignupStep1 onNext={onNext} />)

    const nextButton = screen.getByRole('button', { name: /다음/ })
    expect(nextButton).toBeDisabled()

    await userEvent.type(screen.getByLabelText('이메일'), 'user@uns.dev')
    await userEvent.click(screen.getByRole('button', { name: '이메일 인증' }))
    // 코드 입력 전에는 여전히 비활성
    expect(nextButton).toBeDisabled()

    await userEvent.type(screen.getByLabelText('이메일 인증'), '123456')
    expect(nextButton).toBeEnabled()

    await userEvent.click(nextButton)
    expect(onNext).toHaveBeenCalledWith(
      expect.objectContaining({ email: 'user@uns.dev', code: '123456' }),
      expect.anything(),
    )
  })
})
