import type { ReactNode } from 'react'
import { cn } from '@/shared/utils/cn'

interface AuthLayoutProps {
  children: ReactNode
  /** 너비·간격 조정용 클래스 */
  className?: string
}

/** 인증(로그인·회원가입) 공용 레이아웃 — 다크 캔버스에 중앙 520px 컬럼. */
export function AuthLayout({ children, className }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-canvas px-4 py-12">
      <main className={cn('w-full max-w-[520px]', className)}>{children}</main>
    </div>
  )
}
