import { useCallback, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/shared/components/Button'
import { Input } from '@/shared/components/Input'
import { loginSchema, type LoginInput } from '../../types'
import { PasswordToggle } from '../PasswordToggle'

// 모듈 스코프 상수 (react-perf).
const RESOLVER = zodResolver(loginSchema)
const DEFAULT_VALUES: LoginInput = { email: '', password: '' }

interface LoginFormProps {
  /** 검증 통과 시 호출 */
  onSubmit: (data: LoginInput) => void
  /** 요청 중이면 제출 버튼을 잠근다 */
  pending?: boolean
}

/** 로그인 폼 — 이메일·비밀번호 (비밀번호 표시 토글 포함). */
export function LoginForm({ onSubmit, pending }: LoginFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginInput>({
    resolver: RESOLVER,
    mode: 'onChange',
    defaultValues: DEFAULT_VALUES,
  })

  const [showPassword, setShowPassword] = useState(false)
  const togglePassword = useCallback(() => setShowPassword((v) => !v), [])

  // trailing 슬롯에 JSX를 인라인으로 넘기면 react-perf가 경고하므로 메모이즈한다.
  const passwordToggle = useMemo(
    () => <PasswordToggle shown={showPassword} onToggle={togglePassword} />,
    [showPassword, togglePassword],
  )

  const submit = handleSubmit(onSubmit)

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-12">
      <div className="flex flex-col gap-5">
        <Input
          label="이메일"
          type="email"
          autoComplete="email"
          placeholder="이메일을 입력해주세요"
          state={errors.email ? 'error' : 'default'}
          message={errors.email?.message}
          {...register('email')}
        />
        <Input
          label="비밀번호"
          type={showPassword ? 'text' : 'password'}
          autoComplete="current-password"
          placeholder="비밀번호를 입력해주세요"
          trailingIcon={passwordToggle}
          state={errors.password ? 'error' : 'default'}
          message={errors.password?.message}
          {...register('password')}
        />
      </div>
      <Button
        type="submit"
        variant="primary"
        disabled={!isValid || pending}
        className="w-full"
      >
        로그인
      </Button>
    </form>
  )
}
