import type { ReactNode } from 'react'
import { cn } from '@/shared/utils/cn'

interface AuthLayoutProps {
  children: ReactNode
  /** 너비·간격 조정용 클래스 (중앙 컬럼에 병합) */
  className?: string
  /** 화면 전체를 덮는 배경 레이어 (로그인의 Figma 배경 등). 없으면 캔버스 색만 */
  background?: ReactNode
}

/** 인증(로그인·회원가입) 공용 레이아웃 — 다크 캔버스에 중앙 520px 컬럼. */
export function AuthLayout({
  children,
  className,
  background,
}: AuthLayoutProps) {
  // overflow-hidden을 두면 안에서 열리는 Dropdown 메뉴가 잘린다. 배경 레이어는
  // absolute inset-0으로 래퍼 크기에 딱 맞아 넘칠 일이 없으므로 클립하지 않는다.
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-canvas px-4 py-12">
      {background}
      <main className={cn('relative w-full max-w-[520px]', className)}>
        {children}
      </main>
    </div>
  )
}
