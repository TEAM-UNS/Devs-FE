import { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  AuthHeader,
  AuthLayout,
  SignupStep1,
  SocialLoginButtons,
  Stepper,
} from '@/features/auth'

const TOTAL_STEPS = 4

/** 회원가입 페이지 — 4단계 위저드. 현재 1단계(이메일 인증)만 구현. */
export default function SignupPage() {
  const [step, setStep] = useState(1)
  const isFirstStep = step === 1

  const handleStep1Next = useCallback(() => {
    setStep(2)
  }, [])

  return (
    <AuthLayout>
      <div className="flex flex-col gap-8">
        <Stepper total={TOTAL_STEPS} current={step} />

        <div className="flex flex-col gap-12">
          <AuthHeader title="UNS에 오신 것을 환영해요!" />

          <div className="flex flex-col gap-6">
            {isFirstStep ? (
              <SignupStep1 onNext={handleStep1Next} />
            ) : (
              <p className="py-10 text-center text-body-md text-gray-300">
                {step}단계는 준비 중입니다.
              </p>
            )}

            {/* 간편로그인·로그인 링크는 진입 지점(1단계)에서만 노출 */}
            {isFirstStep && (
              <>
                <div className="flex items-center gap-3">
                  <span className="h-px flex-1 bg-element" />
                  <span className="text-body-sm text-gray-300">간편로그인</span>
                  <span className="h-px flex-1 bg-element" />
                </div>

                <div className="flex flex-col gap-4">
                  <SocialLoginButtons />
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
              </>
            )}
          </div>
        </div>
      </div>
    </AuthLayout>
  )
}
