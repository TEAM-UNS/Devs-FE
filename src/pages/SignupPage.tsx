import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { trackEvent } from '@/shared/analytics'
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
import { PageTitle } from '@/shared/components/PageTitle'

const TOTAL_STEPS = 4

const SIGNUP_DONE_MESSAGE = '회원가입이 완료되었어요! 로그인해주세요.'

/** 단계마다 채워 나가는 가입 정보. 마지막 단계에서 한 번에 제출한다. */
type SignupDraft = Partial<
  SignupStep1Input & SignupStep2Input & SignupStep3Input & SignupStep4Input
> & {
  /** 이메일 인증을 끝낸 시각(ms). 서버가 인증을 30분만 기억해 복원할지 판단한다 */
  verifiedAt?: number
}

const STORAGE_KEY = 'signup-draft'
/* 서버가 이메일 인증을 30분만 기억한다. 그보다 오래된 값은 가입이 거절돼 버린다 */
const VERIFIED_TTL_MS = 30 * 60 * 1000

/** 새로고침 뒤 저장해 둔 가입 정보. 없거나 인증한 지 30분이 지났으면 빈 값 */
function loadDraft(): SignupDraft {
  const saved: SignupDraft | null = JSON.parse(
    sessionStorage.getItem(STORAGE_KEY) ?? 'null',
  )
  if (!saved) return {}
  if (saved.verifiedAt && Date.now() - saved.verifiedAt > VERIFIED_TTL_MS) {
    return {}
  }
  return saved
}

/** 회원가입 페이지 — 4단계 위저드. */
export default function SignupPage() {
  const [draft, setDraft] = useState<SignupDraft>(loadDraft)
  // 비밀번호는 저장하지 않아서, 인증까지 마쳤으면 2단계에서 비밀번호를 다시 받는다
  const [step, setStep] = useState(draft.verifiedAt ? 2 : 1)

  // 값이 바뀔 때마다 저장한다. 남길 값만 골라 비밀번호·인증 코드는 담지 않는다
  useEffect(() => {
    const {
      email,
      verifiedAt,
      name,
      majors,
      careerType,
      careerLevel,
      techStacks,
    } = draft
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        email,
        verifiedAt,
        name,
        majors,
        careerType,
        careerLevel,
        techStacks,
      }),
    )
  }, [draft])

  /* 단계가 입력이 바뀔 때마다 부른다. 단계는 이 함수를 effect 의존성에 넣으므로 렌더마다
     새 함수면 알림 → 렌더 → 새 함수 → 알림이 끝없이 돈다. 그래서 성능이 아니라 그걸 막으려고 고정한다 */
  const handleChange = useCallback((data: SignupDraft) => {
    setDraft((prev) => ({ ...prev, ...data }))
  }, [])

  const navigate = useNavigate()
  const showToast = useToastStore((state) => state.show)
  // 무효화할 캐시가 없어 껍데기 훅을 두지 않고 여기서 바로 선언한다.
  const signupMutation = useMutation({ mutationFn: signup })

  const isFirstStep = step === 1
  // 전공·기술스택 선택 단계(3~4)는 폼이 넓다(708px). 그 외는 520px.
  const isWideStep = step >= 3

  // 1~3단계가 모두 "받은 값을 모으고 다음으로" 라서 핸들러 하나를 함께 쓴다.
  const handleNext = (data: SignupDraft) => {
    // 어떤 단계에서 사용자들이 이탈하는지 알기 위함
    trackEvent('Signup Step Completed', { step })
    // 1단계를 마친 순간이 인증 완료 시각이다
    setDraft((prev) => ({
      ...prev,
      ...data,
      ...(step === 1 && { verifiedAt: Date.now() }),
    }))
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
        personalHistory: toPersonalHistory(draft),
        majorIds: majors.map(Number),
        // 서버는 전공 구분 없이 평평한 id 배열을 받는다.
        skillIds: Object.values(data.techStacks).flat().map(Number),
      },
      {
        onSuccess: () => {
          // 서버가 받아준 뒤라 실패한 시도와 섞이지 않는다
          trackEvent('Signed Up')
          sessionStorage.removeItem(STORAGE_KEY)
          showToast({ type: 'success', title: SIGNUP_DONE_MESSAGE })
          navigate(ROUTES.login)
        },
      },
    )
  }

  return (
    <AuthLayout className={isWideStep ? 'max-w-[708px]' : undefined}>
      <PageTitle name="회원가입" />
      <div className="flex flex-col gap-8">
        <Stepper total={TOTAL_STEPS} current={step} />

        <div className="flex flex-col gap-12">
          <AuthHeader title="UNS에 오신 것을 환영해요!" />

          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-6">
              {step === 1 && (
                <SignupStep1
                  defaultEmail={draft.email}
                  onChange={handleChange}
                  onNext={handleNext}
                />
              )}
              {step === 2 && (
                <SignupStep2
                  defaultName={draft.name}
                  onChange={handleChange}
                  onNext={handleNext}
                />
              )}
              {step === 3 && (
                <SignupStep3
                  initialValues={draft}
                  onChange={handleChange}
                  onNext={handleNext}
                />
              )}
              {step === 4 && (
                <SignupStep4
                  majors={draft.majors}
                  initialValues={draft}
                  onChange={handleChange}
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
