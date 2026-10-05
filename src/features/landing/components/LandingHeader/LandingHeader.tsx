import devsLogo from '@/assets/landing/logo-header.svg'
import { CtaLink } from '../CtaLink'

/** 랜딩 상단 바 — 로고와 로그인·회원가입 진입 */
export function LandingHeader() {
  // Figma 헤더의 배경 블러는 채움 1%라 실제로는 거의 안 먹는다
  // CSS backdrop-blur는 투명도와 상관없이 그대로 흐려서 뒤의 구슬 테두리가 지워지므로 뺀다
  return (
    <header className="absolute inset-x-0 top-0 z-raised flex h-16 items-center justify-between px-12">
      <img src={devsLogo} alt="Devs" className="h-5 w-[105px]" />
      <nav className="flex items-center">
        <CtaLink
          cta="login"
          location="header"
          variant="ghost"
          size="sm"
          className="text-gray-400"
        >
          로그인
        </CtaLink>
        <CtaLink cta="signup" location="header" size="sm">
          회원가입
        </CtaLink>
      </nav>
    </header>
  )
}
