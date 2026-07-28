import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/shared/utils/cn'

type ButtonVariant = 'primary' | 'outline' | 'ghost'
type ButtonSize = 'sm' | 'md'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** 위계 변형 (기본 'primary') */
  variant?: ButtonVariant
  /** 크기 (기본 'md' = Figma medium/h48) */
  size?: ButtonSize
  /** 라벨 앞 아이콘 슬롯 (24px 컨테이너) */
  startIcon?: ReactNode
  /** 라벨 뒤 아이콘 슬롯 (24px 컨테이너) */
  endIcon?: ReactNode
}

// 아래 상수는 모듈 스코프 — 렌더마다 새로 만들지 않는다 (react-perf).

// 공통 골격. 값은 Figma Button 컴포넌트(node 113:1213)에서 그대로 가져옴:
// gap 8px, radius 6px(number/6 → rounded-sm), 라벨 Pretendard SemiBold 16px/1.5.
// transition·focus 링은 Figma엔 없지만 상호작용 부드러움·a11y용으로 추가(모션 토큰 사용).
const BASE_STYLES = [
  'inline-flex items-center justify-center gap-2 rounded-sm',
  'text-base font-semibold whitespace-nowrap',
  'transition-colors duration-fast ease-standard',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
  'disabled:cursor-not-allowed',
].join(' ')

// 위계 변형 — Default/Hover(hover)/Pressed(active)/Disabled 상태색을 Figma 값 그대로.
// primary는 배경색, outline은 테두리(+surface 채움), ghost는 텍스트 색으로 위계를 표현.
const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary: [
    'bg-primary-500 text-white',
    'hover:bg-primary-400 active:bg-primary-300',
    'disabled:bg-gray-200 disabled:text-gray-300',
  ].join(' '),
  outline: [
    'bg-canvas text-white ring-1 ring-inset ring-gray-200',
    'hover:bg-container active:bg-element',
    'disabled:bg-transparent disabled:text-gray-300',
  ].join(' '),
  ghost: [
    'text-primary-400',
    'hover:bg-container active:bg-element',
    'disabled:text-gray-100',
  ].join(' '),
}

// 크기 — 높이·가로 패딩만 다르다(라벨·아이콘·gap은 두 크기 공통).
const SIZE_STYLES: Record<ButtonSize, string> = {
  sm: 'h-8 px-4', // small: h=32, px=16
  md: 'h-12 px-6', // medium: h=48, px=24
}

// 아이콘 슬롯 — Figma 기준 24px 정사각 컨테이너. 아이콘 색은 텍스트 색을 상속.
const ICON_SLOT = 'inline-flex size-6 shrink-0 items-center justify-center'

/**
 * 공용 버튼. 사용자–서비스 상호작용의 트리거로, 위계(variant)에 맞춰 일관되게 배치한다.
 * 색·치수·타이포는 Figma "button" 컴포넌트를 그대로 구현했고 디자인 토큰에 매핑돼 있다.
 * 다크 서피스 기준이며, 아이콘은 start/end 슬롯으로 조합한다.
 *
 * @param props.variant 위계 변형 ('primary' | 'outline' | 'ghost', 기본 'primary')
 * @param props.size 크기 ('sm'=32 | 'md'=48, 기본 'md')
 * @param props.startIcon 라벨 앞 아이콘
 * @param props.endIcon 라벨 뒤 아이콘
 * @param props.className 추가로 병합할 Tailwind 클래스
 * @returns 스타일이 적용된 `<button>` 엘리먼트
 */
export function Button({
  variant = 'primary',
  size = 'md',
  startIcon,
  endIcon,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        BASE_STYLES,
        VARIANT_STYLES[variant],
        SIZE_STYLES[size],
        className,
      )}
      {...props}
    >
      {startIcon && (
        <span className={ICON_SLOT} aria-hidden="true">
          {startIcon}
        </span>
      )}
      {children}
      {endIcon && (
        <span className={ICON_SLOT} aria-hidden="true">
          {endIcon}
        </span>
      )}
    </button>
  )
}
