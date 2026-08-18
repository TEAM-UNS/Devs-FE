import { Link, useLocation, useNavigate } from 'react-router-dom'
import loginBackgroundSrc from '@/assets/login-background.webp'
import { ROUTES } from '@/shared/constants'
import {
  AuthDivider,
  AuthHeader,
  AuthLayout,
  LoginForm,
  SocialLoginButtons,
  useLogin,
  type LoginInput,
} from '@/features/auth'

// 모듈 스코프 — 렌더마다 새 엘리먼트를 만들지 않는다 (react-perf).
// 배경은 Figma 프레임을 통째로 export한 이미지다. 큰 구는 벡터지만 작은 유리 원의
// GLASS 효과가 SVG로 표현되지 않아, 프레임 전체를 2배 래스터(WebP)로 가져왔다.
const BACKGROUND = (
  <img
    src={loginBackgroundSrc}
    alt=""
    aria-hidden="true"
    className="pointer-events-none absolute inset-0 size-full object-cover"
  />
)

/** 로그인 페이지 — 이메일·비밀번호 + 간편로그인(소셜). */
export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const loginMutation = useLogin()

  // 가드가 넘겨준 원래 목적지 (없으면 홈)
  const redirectTo =
    (location.state as { from?: string } | null)?.from ?? ROUTES.home

  // 토큰 저장은 useLogin이, 실패 토스트는 queryClient가 맡는다. 여기 남는 건 이동뿐이다.
  const handleLogin = (data: LoginInput) => {
    loginMutation.mutate(data, {
      // replace: 뒤로가기로 로그인 화면에 다시 돌아오지 않게 한다.
      onSuccess: () => navigate(redirectTo, { replace: true }),
    })
  }

  return (
    <AuthLayout background={BACKGROUND}>
      <div className="flex flex-col gap-12">
        <AuthHeader title="다시 만나서 반가워요!" />

        <div className="flex flex-col gap-6">
          <LoginForm onSubmit={handleLogin} pending={loginMutation.isPending} />

          <AuthDivider label="간편로그인" />

          <div className="flex flex-col gap-4">
            <SocialLoginButtons />
            <p className="flex items-center justify-center gap-1.5 text-body-sm">
              <span className="text-gray-300">아직 계정이 없으신가요?</span>
              <Link
                to={ROUTES.signup}
                className="font-semibold text-primary-500 hover:text-primary-600"
              >
                회원가입
              </Link>
            </p>
          </div>
        </div>
      </div>
    </AuthLayout>
  )
}
