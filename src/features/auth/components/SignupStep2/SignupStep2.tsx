import { useCallback, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/shared/components/Button'
import { Input } from '@/shared/components/Input'
import {
  ChevronRightIcon,
  EyeIcon,
  EyeOffIcon,
} from '@/shared/components/icons'
import { signupStep2Schema, type SignupStep2Input } from '../../types'

// 모듈 스코프 상수 (react-perf).
const RESOLVER = zodResolver(signupStep2Schema)
const DEFAULT_VALUES: SignupStep2Input = {
  name: '',
  password: '',
  passwordConfirm: '',
}
const NEXT_ICON = <ChevronRightIcon className="size-full" />

interface PasswordToggleProps {
  shown: boolean
  onToggle: () => void
}

/** 비밀번호 표시/숨김 토글 버튼 (Input trailing 슬롯용, 접근성 라벨 포함). */
function PasswordToggle({ shown, onToggle }: PasswordToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={shown ? '비밀번호 숨기기' : '비밀번호 표시'}
      aria-pressed={shown}
      className="flex size-full items-center justify-center text-gray-300 transition-colors hover:text-white"
    >
      {shown ? (
        <EyeIcon className="size-full" />
      ) : (
        <EyeOffIcon className="size-full" />
      )}
    </button>
  )
}

interface SignupStep2Props {
  /** 검증 통과 시 호출 */
  onNext: (data: SignupStep2Input) => void
}

/** 회원가입 2단계 — 이름·비밀번호 설정 (비밀번호 표시 토글 포함). */
export function SignupStep2({ onNext }: SignupStep2Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<SignupStep2Input>({
    resolver: RESOLVER,
    mode: 'onChange',
    defaultValues: DEFAULT_VALUES,
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const togglePassword = useCallback(() => setShowPassword((v) => !v), [])
  const toggleConfirm = useCallback(() => setShowConfirm((v) => !v), [])

  // trailing 슬롯에 JSX를 인라인으로 넘기면 react-perf가 경고하므로 메모이즈한다.
  const passwordToggle = useMemo(
    () => <PasswordToggle shown={showPassword} onToggle={togglePassword} />,
    [showPassword, togglePassword],
  )
  const confirmToggle = useMemo(
    () => <PasswordToggle shown={showConfirm} onToggle={toggleConfirm} />,
    [showConfirm, toggleConfirm],
  )

  const submit = handleSubmit(onNext)

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-12">
      <div className="flex flex-col gap-5">
        <Input
          label="이름"
          autoComplete="name"
          placeholder="이름을 입력해주세요"
          state={errors.name ? 'error' : 'default'}
          message={errors.name?.message}
          {...register('name')}
        />
        <Input
          label="비밀번호"
          type={showPassword ? 'text' : 'password'}
          autoComplete="new-password"
          placeholder="비밀번호를 입력해주세요"
          trailingIcon={passwordToggle}
          state={errors.password ? 'error' : 'default'}
          message={errors.password?.message}
          {...register('password')}
        />
        <Input
          label="비밀번호 확인"
          type={showConfirm ? 'text' : 'password'}
          autoComplete="new-password"
          placeholder="비밀번호를 다시 입력해주세요"
          trailingIcon={confirmToggle}
          state={errors.passwordConfirm ? 'error' : 'default'}
          message={errors.passwordConfirm?.message}
          {...register('passwordConfirm')}
        />
      </div>
      <Button
        type="submit"
        variant="primary"
        disabled={!isValid}
        endIcon={NEXT_ICON}
        className="w-full"
      >
        다음
      </Button>
    </form>
  )
}
