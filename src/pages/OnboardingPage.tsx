import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/shared/constants'
import { useToastStore } from '@/shared/stores/useToastStore'
import {
  AuthHeader,
  AuthLayout,
  SignupStep3,
  SignupStep4,
  Stepper,
  toPersonalHistory,
  useOnboarding,
  type SignupStep3Input,
  type SignupStep4Input,
} from '@/features/auth'

const TOTAL_STEPS = 2

const ONBOARDING_DONE_MESSAGE = '설정이 완료되었어요!'

/**
 * 온보딩 — 소셜 로그인으로 처음 들어온 사용자가 전공·기술 스택을 채우는 화면.
 *
 * 회원가입 3·4단계와 고르는 값이 같아 그 화면을 그대로 재활용한다. 회원가입 흐름으로
 * 라우팅하지 않는 이유는 제출 모양이 다르기 때문이다 — 회원가입은 `POST /user/signup`
 * 하나로 계정까지 만들지만, 여기는 계정이 이미 있고 `PUT /user/major`·`PUT /user/tech-stack`으로
 * 두 값만 채운다.
 *
 * 이미 로그인된 상태에서 보는 화면이지만 회원가입처럼 전체 화면이라 RootLayout 밖에 둔다.
 */
export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  // 4단계가 노출할 기술 스택을 전공으로 거르고, 제출 본문에도 함께 실어야 해서 들고 있는다.
  const [majorStep, setMajorStep] = useState<SignupStep3Input>()

  const navigate = useNavigate()
  const showToast = useToastStore((state) => state.show)
  const onboardingMutation = useOnboarding()

  const handleMajorNext = (data: SignupStep3Input) => {
    setMajorStep(data)
    setStep(2)
  }

  const handleSubmit = (data: SignupStep4Input) => {
    // 3단계를 거치지 않으면 도달할 수 없지만, 타입을 좁히려면 확인이 필요하다.
    if (!majorStep) return

    onboardingMutation.mutate(
      {
        personalHistory: toPersonalHistory(majorStep),
        majorIds: majorStep.majors.map(Number),
        // 서버는 전공 구분 없이 평평한 id 배열을 받는다.
        skillIds: Object.values(data.techStacks).flat().map(Number),
      },
      {
        onSuccess: () => {
          showToast({ type: 'success', title: ONBOARDING_DONE_MESSAGE })
          // replace: 뒤로가기로 온보딩에 다시 돌아오지 않게 한다.
          navigate(ROUTES.home, { replace: true })
        },
      },
    )
  }

  return (
    <AuthLayout className="max-w-[708px]">
      <div className="flex flex-col gap-8">
        <Stepper total={TOTAL_STEPS} current={step} />

        <div className="flex flex-col gap-12">
          <AuthHeader title="마지막으로 관심사를 알려주세요!" />

          <div className="flex flex-col gap-6">
            {step === 1 && <SignupStep3 onNext={handleMajorNext} />}
            {step === 2 && (
              <SignupStep4
                majors={majorStep?.majors}
                onSubmit={handleSubmit}
                pending={onboardingMutation.isPending}
                submitLabel="시작하기"
              />
            )}
          </div>
        </div>
      </div>
    </AuthLayout>
  )
}
