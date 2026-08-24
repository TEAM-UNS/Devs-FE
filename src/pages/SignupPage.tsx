import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { ROUTES } from '@/shared/constants'
import { useToastStore } from '@/shared/stores/useToastStore'
import {
  AuthHeader,
  AuthLayout,
  SignupStep1,
  SignupStep2,
  SignupStep3,
  SignupStep4,
  AuthDivider,
  SocialLoginButtons,
  Stepper,
  signup,
  startOAuthLogin,
  toPersonalHistory,
  type SignupStep1Input,
  type SignupStep2Input,
  type SignupStep3Input,
  type SignupStep4Input,
} from '@/features/auth'

const TOTAL_STEPS = 4

const SIGNUP_DONE_MESSAGE = '회원가입이 완료되었어요! 로그인해주세요.'

/** 1~3단계가 채워 나가는 가입 정보. 마지막 단계에서 한 번에 제출한다. */
type SignupDraft = Partial<
  SignupStep1Input & SignupStep2Input & SignupStep3Input
>

/** 회원가입 페이지 — 4단계 위저드. */
export default function SignupPage() {
  const [step, setStep] = useState(1)
  const [draft, setDraft] = useState<SignupDraft>({})

  const navigate = useNavigate()
  const showToast = useToastStore((state) => state.show)
  // 무효화할 캐시가 없어 껍데기 훅을 두지 않고 여기서 바로 선언한다.
  const signupMutation = useMutation({ mutationFn: signup })

  const isFirstStep = step === 1
  // 전공·기술스택 선택 단계(3~4)는 폼이 넓다(708px). 그 외는 520px.
  const isWideStep = step >= 3

  // 1~3단계가 모두 "받은 값을 모으고 다음으로" 라서 핸들러 하나를 함께 쓴다.
  const handleNext = (data: SignupDraft) => {
    setDraft((prev) => ({ ...prev, ...data }))
    setStep((s) => Math.min(s + 1, TOTAL_STEPS))
  }

  const handleSignup = (data: SignupStep4Input) => {
    const { email, name, password, majors } = draft
    // 앞 단계를 거치지 않으면 도달할 수 없지만, 타입을 좁히려면 확인이 필요하다.
    if (!email || !name || !password || !majors) return

    signupMutation.mutate(
      {
        email,
        name,
        password,
        personal_history: toPersonalHistory(draft),
        major_ids: majors.map(Number),
        // 서버는 전공 구분 없이 평평한 id 배열을 받는다.
        skill_ids: Object.values(data.techStacks).flat().map(Number),
      },
      {
        onSuccess: () => {
          showToast({ type: 'success', title: SIGNUP_DONE_MESSAGE })
          navigate(ROUTES.login)
        },
      },
    )
  }

  return (
    <AuthLayout className={isWideStep ? 'max-w-[708px]' : undefined}>
      <div className="flex flex-col gap-8">
        <Stepper total={TOTAL_STEPS} current={step} />

        <div className="flex flex-col gap-12">
          <AuthHeader title="UNS에 오신 것을 환영해요!" />

          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-6">
              {step === 1 && <SignupStep1 onNext={handleNext} />}
              {step === 2 && <SignupStep2 onNext={handleNext} />}
              {step === 3 && <SignupStep3 onNext={handleNext} />}
              {step === 4 && (
                <SignupStep4
                  majors={draft.majors}
                  onSubmit={handleSignup}
                  pending={signupMutation.isPending}
                />
              )}

              {/* 간편로그인(소셜)은 진입 지점(1단계)에서만 노출 */}
              {isFirstStep && (
                <>
                  <AuthDivider label="간편로그인" />
                  <SocialLoginButtons
                    onGoogleClick={() => startOAuthLogin('google')}
                    onGithubClick={() => startOAuthLogin('github')}
                  />
                </>
              )}
            </div>

            {/* '로그인' 링크는 전 단계 공통 */}
            <p className="flex items-center justify-center gap-1.5 text-body-sm">
              <span className="text-gray-300">계정이 있으신가요?</span>
              <Link
                to={ROUTES.login}
                className="font-semibold text-primary-500 hover:text-primary-600"
              >
                로그인
              </Link>
            </p>
          </div>
        </div>
      </div>
    </AuthLayout>
  )
}
