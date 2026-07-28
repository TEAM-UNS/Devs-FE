import { useCallback } from 'react'
import { Link } from 'react-router-dom'
import loginBackgroundSrc from '@/assets/login-background.webp'
import {
  AuthDivider,
  AuthHeader,
  AuthLayout,
  LoginForm,
  SocialLoginButtons,
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
  const handleLogin = useCallback(() => {
    // TODO: 로그인 API 연동
  }, [])

  return (
    <AuthLayout background={BACKGROUND}>
      <div className="flex flex-col gap-12">
        <AuthHeader title="다시 만나서 반가워요!" />

        <div className="flex flex-col gap-6">
          <LoginForm onSubmit={handleLogin} />

          <AuthDivider label="간편로그인" />

          <div className="flex flex-col gap-4">
            <SocialLoginButtons />
            <p className="flex items-center justify-center gap-1.5 text-body-sm">
              <span className="text-gray-300">아직 계정이 없으신가요?</span>
              <Link
                to="/signup"
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
