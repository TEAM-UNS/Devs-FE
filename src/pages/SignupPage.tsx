import { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  AuthHeader,
  AuthLayout,
  SignupStep1,
  SignupStep2,
  SignupStep3,
  SocialLoginButtons,
  Stepper,
} from '@/features/auth'

const TOTAL_STEPS = 4

/** 회원가입 페이지 — 4단계 위저드. 현재 1~3단계 구현. */
export default function SignupPage() {
  const [step, setStep] = useState(1)
  const isFirstStep = step === 1
  // 전공·기술스택 선택 단계(3~4)는 폼이 넓다(708px). 그 외는 520px.
  const isWideStep = step >= 3

  const handleNext = useCallback(() => {
    setStep((s) => Math.min(s + 1, TOTAL_STEPS))
  }, [])

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
              {step >= 4 && (
                <p className="py-10 text-center text-body-md text-gray-300">
                  {step}단계는 준비 중입니다.
                </p>
              )}

              {/* 간편로그인(소셜)은 진입 지점(1단계)에서만 노출 */}
              {isFirstStep && (
                <>
                  <div className="flex items-center gap-3">
                    <span className="h-px flex-1 bg-element" />
                    <span className="text-body-sm text-gray-300">
                      간편로그인
                    </span>
                    <span className="h-px flex-1 bg-element" />
                  </div>
                  <SocialLoginButtons />
                </>
              )}
            </div>

            {/* '로그인' 링크는 전 단계 공통 */}
            <p className="flex items-center justify-center gap-1.5 text-body-sm">
              <span className="text-gray-300">계정이 있으신가요?</span>
              <Link
                to="/login"
                className="font-semibold text-primary-400 hover:text-primary-300"
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
