import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useToastStore } from '@/shared/stores/useToastStore'
import { renderWithQuery } from '@/test/renderWithQuery'
import { SignupStep1 } from './SignupStep1'

// 이 컴포넌트는 발송·검증 API를 부른다. jsdom엔 서버가 없으므로 성공 응답으로 대체하고,
// 화면 전환(코드 입력 열림·타이머·토스트)만 검증한다.
vi.mock('../../api', () => ({
  sendEmailCode: vi.fn(() => Promise.resolve({ message: 'sent' })),
  verifyEmail: vi.fn(() => Promise.resolve({ message: 'verified' })),
}))

const noop = () => {}

describe('SignupStep1', () => {
  // 토스트는 전역 스토어에 쌓이므로 테스트 간에 비워 준다.
  beforeEach(() => {
    useToastStore.setState({ toasts: [] })
  })

  it('이메일·인증코드 입력과 인증·다음 버튼을 렌더링한다', () => {
    renderWithQuery(<SignupStep1 onNext={noop} />)

    expect(screen.getByLabelText('이메일')).toBeInTheDocument()
    expect(screen.getByLabelText('이메일 인증')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: '이메일 인증' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /다음/ })).toBeInTheDocument()
  })

  it('올바른 이메일을 입력하기 전에는 인증 버튼이 비활성이다', async () => {
    renderWithQuery(<SignupStep1 onNext={noop} />)

    const verifyButton = screen.getByRole('button', { name: '이메일 인증' })
    expect(verifyButton).toBeDisabled()

    await userEvent.type(screen.getByLabelText('이메일'), 'not-an-email')
    expect(verifyButton).toBeDisabled()

    await userEvent.clear(screen.getByLabelText('이메일'))
    await userEvent.type(screen.getByLabelText('이메일'), 'user@uns.dev')
    expect(verifyButton).toBeEnabled()
  })

  it('인증 요청 전에는 코드 입력이 막혀 있다', () => {
    renderWithQuery(<SignupStep1 onNext={noop} />)

    expect(screen.getByLabelText('이메일 인증')).toBeDisabled()
  })

  it('발송이 성공하면 코드 입력이 열리고 타이머(3:00)가 뜬다', async () => {
    renderWithQuery(<SignupStep1 onNext={noop} />)

    await userEvent.type(screen.getByLabelText('이메일'), 'user@uns.dev')
    await userEvent.click(screen.getByRole('button', { name: '이메일 인증' }))

    // 응답이 온 뒤에 열리므로 findBy로 기다린다
    expect(await screen.findByText('3:00')).toBeInTheDocument()
    expect(screen.getByLabelText('이메일 인증')).toBeEnabled()
    // 전송 후에는 재전송을 막는다 (Figma 120:1684 이후 인증 버튼 비활성)
    expect(screen.getByRole('button', { name: '이메일 인증' })).toBeDisabled()
    // 전송 성공 토스트 — 표시는 App에 마운트된 ToastViewport의 몫이라 스토어를 본다
    expect(useToastStore.getState().toasts).toEqual([
      expect.objectContaining({
        type: 'success',
        title: '이메일이 전송되었어요! 메일함을 확인해주세요.',
      }),
    ])
  })

  it('이메일을 바꾸면 이전 코드가 무효가 되고 재전송이 열린다', async () => {
    renderWithQuery(<SignupStep1 onNext={noop} />)

    const emailInput = screen.getByLabelText('이메일')
    await userEvent.type(emailInput, 'user@uns.dev')
    await userEvent.click(screen.getByRole('button', { name: '이메일 인증' }))
    await screen.findByText('3:00')

    const codeInput = screen.getByLabelText('이메일 인증')
    await userEvent.type(codeInput, '123456')
    expect(screen.getByRole('button', { name: /다음/ })).toBeEnabled()

    // 이메일을 바꾸면 그 코드는 다른 주소로 발급된 것이라 쓸 수 없다.
    await userEvent.type(emailInput, '.kr')

    expect(codeInput).toBeDisabled()
    expect(codeInput).toHaveValue('')
    expect(screen.getByRole('button', { name: /다음/ })).toBeDisabled()
    // 새 주소로 다시 받을 수 있어야 한다.
    expect(screen.getByRole('button', { name: '이메일 인증' })).toBeEnabled()
  })

  it('발송이 실패하면 에러 토스트를 띄우고 코드 입력을 열지 않는다', async () => {
    const { sendEmailCode } = await import('../../api')
    vi.mocked(sendEmailCode).mockRejectedValueOnce(new Error('boom'))

    renderWithQuery(<SignupStep1 onNext={noop} />)

    await userEvent.type(screen.getByLabelText('이메일'), 'user@uns.dev')
    await userEvent.click(screen.getByRole('button', { name: '이메일 인증' }))

    await waitFor(() => {
      expect(useToastStore.getState().toasts).toEqual([
        expect.objectContaining({ type: 'error' }),
      ])
    })
    expect(screen.getByLabelText('이메일 인증')).toBeDisabled()
  })

  it('코드 검증이 성공해야 onNext로 값이 전달된다', async () => {
    const onNext = vi.fn()
    renderWithQuery(<SignupStep1 onNext={onNext} />)

    const nextButton = screen.getByRole('button', { name: /다음/ })
    expect(nextButton).toBeDisabled()

    await userEvent.type(screen.getByLabelText('이메일'), 'user@uns.dev')
    await userEvent.click(screen.getByRole('button', { name: '이메일 인증' }))
    await screen.findByText('3:00')
    // 코드 입력 전에는 여전히 비활성
    expect(nextButton).toBeDisabled()

    await userEvent.type(screen.getByLabelText('이메일 인증'), '123456')
    expect(nextButton).toBeEnabled()

    await userEvent.click(nextButton)
    await waitFor(() => {
      expect(onNext).toHaveBeenCalledWith({
        email: 'user@uns.dev',
        code: '123456',
      })
    })
  })
})
