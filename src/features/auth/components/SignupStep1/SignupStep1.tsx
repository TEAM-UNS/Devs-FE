import { useCallback, useId, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/shared/components/Button'
import { Input } from '@/shared/components/Input'
import { ChevronRightIcon } from '@/shared/components/icons'
import { useCountdown } from '../../hooks/useCountdown'
import {
  CODE_LENGTH,
  emailOnlySchema,
  signupStep1Schema,
  type SignupStep1Input,
} from '../../types'

// 모듈 스코프 상수 (react-perf).
const RESOLVER = zodResolver(signupStep1Schema)
const DEFAULT_VALUES: SignupStep1Input = { email: '', code: '' }
const NEXT_ICON = <ChevronRightIcon className="size-full" />
const CODE_TTL = 300 // 인증 코드 유효시간 5:00 (초)

/** 초를 m:ss 형식으로 포맷한다. */
function formatTimer(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

interface SignupStep1Props {
  /** 검증 통과 시 호출 */
  onNext: (data: SignupStep1Input) => void
}

/** 회원가입 1단계 — 이메일 인증. 코드 전송 후 6자리 입력 시 '다음' 활성화. */
export function SignupStep1({ onNext }: SignupStep1Props) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<SignupStep1Input>({
    resolver: RESOLVER,
    mode: 'onChange',
    defaultValues: DEFAULT_VALUES,
  })

  const emailId = useId()
  const [codeSent, setCodeSent] = useState(false)
  const { secondsLeft, start: startCountdown } = useCountdown()

  const email = watch('email')
  const emailValid = emailOnlySchema.safeParse(email).success

  const handleSendCode = useCallback(() => {
    // TODO: 실제 인증 코드 발송 API 연동
    // TODO: 타이머 만료 시 재전송 버튼 노출
    setCodeSent(true)
    startCountdown(CODE_TTL)
  }, [startCountdown])

  const submit = handleSubmit(onNext)

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-12">
      <div className="flex flex-col gap-5">
        {/* 레이블을 행 위로 빼 필드와 버튼(둘 다 h-12)을 같은 높이로 정렬 */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor={emailId} className="text-body-md text-white">
            이메일
          </label>
          <div className="flex items-start gap-3">
            <Input
              id={emailId}
              type="email"
              autoComplete="email"
              placeholder="이메일을 입력해주세요"
              className="flex-1"
              state={errors.email ? 'error' : 'default'}
              message={errors.email?.message}
              {...register('email')}
            />
            <Button
              type="button"
              variant="primary"
              disabled={!emailValid}
              onClick={handleSendCode}
              className="shrink-0"
            >
              이메일 인증
            </Button>
          </div>
        </div>
        <Input
          label="이메일 인증"
          inputMode="numeric"
          maxLength={CODE_LENGTH}
          placeholder={`전송된 코드 ${CODE_LENGTH}자리를 입력해주세요`}
          disabled={!codeSent}
          timer={codeSent ? formatTimer(secondsLeft) : undefined}
          state={errors.code ? 'error' : 'default'}
          message={errors.code?.message}
          {...register('code')}
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
