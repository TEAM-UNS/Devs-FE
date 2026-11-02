import type { ReactNode } from 'react'
import { ArrowIcon } from '@/shared/components/icons'
import { cn } from '@/shared/utils/cn'

interface AuthLayoutProps {
  children: ReactNode
  /** 너비·간격 조정용 클래스 (중앙 컬럼에 병합) */
  className?: string
  /** 화면 전체를 덮는 배경 레이어 (로그인의 Figma 배경 등). 없으면 캔버스 색만 */
  background?: ReactNode
  /** 있으면 화면 왼쪽 위에 이전 단계로 가는 화살표를 띄운다 */
  onBack?: () => void
}

/** 인증(로그인·회원가입) 공용 레이아웃 — 다크 캔버스에 중앙 520px 컬럼. */
export function AuthLayout({
  children,
  className,
  background,
  onBack,
}: AuthLayoutProps) {
  // overflow-hidden을 두면 안에서 열리는 Dropdown 메뉴가 잘린다. 배경 레이어는
  // absolute inset-0으로 래퍼 크기에 딱 맞아 넘칠 일이 없으므로 클립하지 않는다.
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-canvas px-4 py-12">
      {background}
      {/* Figma는 폼이 아니라 화면 왼쪽 위에서 36px 떨어진 자리라 컬럼 밖에 둔다 */}
      {onBack && (
        <button
          type="button"
          aria-label="이전 단계로"
          onClick={onBack}
          className="absolute left-9 top-9 size-6 text-white focus-visible:outline-2 focus-visible:outline-primary-500"
        >
          <ArrowIcon className="size-full" />
        </button>
      )}
      <main className={cn('relative w-full max-w-[520px]', className)}>
        {children}
      </main>
    </div>
  )
}
