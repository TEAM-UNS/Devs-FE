import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { trackEvent } from '@/shared/analytics'
import { buttonClassName } from '@/shared/components/Button'
import { ROUTES } from '@/shared/constants'

type Cta = 'login' | 'signup'

const CTA_PATHS: Record<Cta, string> = {
  login: ROUTES.login,
  signup: ROUTES.signup,
}

interface CtaLinkProps {
  cta: Cta
  /** 어느 자리의 버튼인지. 같은 버튼이라도 자리별 클릭을 따로 보려고 이벤트에 싣는다 */
  location: 'header' | 'hero' | 'closing'
  variant?: Parameters<typeof buttonClassName>[0]
  size?: Parameters<typeof buttonClassName>[1]
  className?: string
  children: ReactNode
}

/**
 * 버튼 모양의 로그인·회원가입 링크. 누르면 어느 버튼이 눌렸는지 기록한다
 * 이동은 링크라 새 탭 열기·주소 복사가 된다
 */
export function CtaLink({
  cta,
  location,
  variant,
  size,
  className,
  children,
}: CtaLinkProps) {
  return (
    <Link
      to={CTA_PATHS[cta]}
      className={buttonClassName(variant, size, className)}
      onClick={() => trackEvent('Landing CTA Clicked', { cta, location })}
    >
      {children}
    </Link>
  )
}
