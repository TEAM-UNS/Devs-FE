import { useEffect, useId, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/shared/components/Button'
import { Input } from '@/shared/components/Input'
import { ArrowIcon } from '@/shared/components/icons'
import { useToastStore } from '@/shared/stores/useToastStore'
import { sendEmailCode, verifyEmail } from '../../api'
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
const NEXT_ICON = <ArrowIcon className="size-full rotate-180" />
const CODE_TTL = 180 // 인증 코드 유효시간 3:00 (초) — Figma 타이머 표기 기준

const SENT_MESSAGE = '이메일이 전송되었어요! 메일함을 확인해주세요.'

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
    setValue,
    formState: { errors, isValid },
  } = useForm<SignupStep1Input>({
    resolver: RESOLVER,
    mode: 'onChange',
    defaultValues: DEFAULT_VALUES,
  })

  const emailId = useId()
  const { secondsLeft, start: startCountdown } = useCountdown()

  const showToast = useToastStore((state) => state.show)
  // 무효화할 캐시가 없어 껍데기 훅을 두지 않고 여기서 바로 선언한다.
  const sendCode = useMutation({ mutationFn: sendEmailCode })
  const verify = useMutation({ mutationFn: verifyEmail })

  // 코드를 보낸 이메일. 지금 입력된 이메일과 달라지면 그 코드는 더 이상 쓸 수 없다.
  const [sentTo, setSentTo] = useState<string>()

  const email = watch('email')
  const emailValid = emailOnlySchema.safeParse(email).success

  // 코드가 살아 있는 조건: 보낸 이메일 그대로 + 유효시간 남음.
  // 둘 중 하나만 깨져도 입력을 닫고 재전송을 연다.
  const codeActive = sentTo === email && secondsLeft > 0

  // 이메일을 바꾸면 이전 코드로 다음 단계에 가지 못하도록 입력값도 비운다.
  useEffect(() => {
    if (sentTo !== undefined && sentTo !== email) setValue('code', '')
  }, [email, sentTo, setValue])

  // 실패 토스트는 queryClient가 전역으로 띄운다 — 여긴 성공 경로만 다룬다.
  const handleSendCode = () => {
    sendCode.mutate(
      { email },
      {
        onSuccess: () => {
          setSentTo(email)
          startCountdown(CODE_TTL)
          showToast({ type: 'success', title: SENT_MESSAGE })
        },
      },
    )
  }

  // 코드가 맞을 때만 다음 단계로 넘어간다.
  const submit = handleSubmit((data) => {
    verify.mutate(data, { onSuccess: () => onNext(data) })
  })

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
              disabled={!emailValid || codeActive || sendCode.isPending}
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
          disabled={!codeActive}
          timer={codeActive ? formatTimer(secondsLeft) : undefined}
          state={errors.code ? 'error' : 'default'}
          message={errors.code?.message}
          {...register('code')}
        />
      </div>
      <Button
        type="submit"
        variant="primary"
        disabled={!isValid || !codeActive || verify.isPending}
        endIcon={NEXT_ICON}
        className="w-full"
      >
        다음
      </Button>
    </form>
  )
}
