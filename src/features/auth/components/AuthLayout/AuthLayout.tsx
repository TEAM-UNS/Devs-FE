import type { ReactNode } from 'react'
import { ArrowIcon } from '@/shared/components/icons'
import { cn } from '@/shared/utils/cn'

type AuthLayoutAlign = 'center' | 'top'

// 로그인은 세로 가운데, 회원가입은 단계 점부터 위에서 쌓인다 (Figma 프레임)
// 모바일 좌우 여백도 두 화면이 달라서(20 / 32) 같이 묶는다
const ALIGN_STYLES: Record<AuthLayoutAlign, string> = {
  center: 'items-center px-5',
  top: 'items-start px-8',
}

interface AuthLayoutProps {
  children: ReactNode
  /** 너비·간격 조정용 클래스 (중앙 컬럼에 병합) */
  className?: string
  /** 화면 전체를 덮는 배경 레이어 (로그인의 Figma 배경 등). 없으면 캔버스 색만 */
  background?: ReactNode
  /** 있으면 화면 왼쪽 위에 이전 단계로 가는 화살표를 띄운다 */
  onBack?: () => void
  /** 세로 정렬 (기본 'center') */
  align?: AuthLayoutAlign
}

/** 인증(로그인·회원가입) 공용 레이아웃 — 다크 캔버스에 중앙 520px 컬럼. */
export function AuthLayout({
  children,
  className,
  background,
  onBack,
  align = 'center',
}: AuthLayoutProps) {
  // overflow-hidden을 두면 안에서 열리는 Dropdown 메뉴가 잘린다. 배경 레이어는
  // absolute inset-0으로 래퍼 크기에 딱 맞아 넘칠 일이 없으므로 클립하지 않는다.
  return (
    // 위아래 여백은 Figma 프레임 값 — 모바일 60 / 패드·PC 80
    <div
      className={cn(
        'relative flex min-h-screen w-full justify-center bg-canvas py-15 md:px-8 md:py-20',
        ALIGN_STYLES[align],
      )}
    >
      {background}
      {/* Figma는 폼이 아니라 화면 왼쪽 위에서 36px 떨어진 자리라 컬럼 밖에 둔다
          모바일은 단계 점과 높이를 맞춰 50px 내려온다 */}
      {onBack && (
        <button
          type="button"
          aria-label="이전 단계로"
          onClick={onBack}
          className="absolute left-9 top-12.5 size-6 text-white focus-visible:outline-2 focus-visible:outline-primary-500 md:top-9"
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
