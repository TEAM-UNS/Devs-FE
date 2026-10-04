import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { SignupStep2 } from './SignupStep2'

const noop = () => {}
// 규칙 통과 비밀번호: 8~20자·영문+숫자·연속/동일 4자 없음
const VALID_PW = 'unsData82'

describe('SignupStep2', () => {
  it('이름·비밀번호·비밀번호 확인 입력과 다음 버튼을 렌더링한다', () => {
    render(<SignupStep2 onNext={noop} />)

    expect(screen.getByLabelText('이름')).toBeInTheDocument()
    expect(screen.getByLabelText('비밀번호')).toBeInTheDocument()
    expect(screen.getByLabelText('비밀번호 확인')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /다음/ })).toBeInTheDocument()
  })

  it('비밀번호 표시 토글이 입력 타입과 접근성 라벨을 전환한다', async () => {
    render(<SignupStep2 onNext={noop} />)

    const passwordInput = screen.getByLabelText('비밀번호')
    expect(passwordInput).toHaveAttribute('type', 'password')

    // 첫 번째 '비밀번호 표시' 버튼 = 비밀번호 필드의 토글
    const toggles = screen.getAllByRole('button', { name: '비밀번호 표시' })
    await userEvent.click(toggles[0])

    expect(passwordInput).toHaveAttribute('type', 'text')
    expect(
      screen.getByRole('button', { name: '비밀번호 숨기기' }),
    ).toHaveAttribute('aria-pressed', 'true')
    // 확인 필드는 영향받지 않는다
    expect(screen.getByLabelText('비밀번호 확인')).toHaveAttribute(
      'type',
      'password',
    )
  })

  it('영문만 있는 비밀번호는 규칙 에러를 보여준다', async () => {
    render(<SignupStep2 onNext={noop} />)

    await userEvent.type(screen.getByLabelText('비밀번호'), 'aaabbbcc')

    expect(await screen.findByText(/영문, 숫자를 조합/)).toBeInTheDocument()
  })

  it('비밀번호와 확인이 다르면 에러를 보여주고 다음이 비활성이다', async () => {
    render(<SignupStep2 onNext={noop} />)

    await userEvent.type(screen.getByLabelText('이름'), '홍길동')
    await userEvent.type(screen.getByLabelText('비밀번호'), VALID_PW)
    await userEvent.type(screen.getByLabelText('비밀번호 확인'), 'unsData99')

    expect(
      await screen.findByText('비밀번호가 일치하지 않아요'),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /다음/ })).toBeDisabled()
  })

  it('이름·비밀번호·확인이 모두 유효하면 다음이 활성화되고 onNext로 값이 전달된다', async () => {
    const onNext = vi.fn()
    render(<SignupStep2 onNext={onNext} />)

    const nextButton = screen.getByRole('button', { name: /다음/ })
    expect(nextButton).toBeDisabled()

    await userEvent.type(screen.getByLabelText('이름'), '홍길동')
    await userEvent.type(screen.getByLabelText('비밀번호'), VALID_PW)
    await userEvent.type(screen.getByLabelText('비밀번호 확인'), VALID_PW)

    expect(nextButton).toBeEnabled()
    await userEvent.click(nextButton)

    expect(onNext).toHaveBeenCalledWith(
      expect.objectContaining({
        name: '홍길동',
        password: VALID_PW,
        passwordConfirm: VALID_PW,
      }),
      expect.anything(),
    )
  })
})
