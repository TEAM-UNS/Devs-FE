import type { ButtonHTMLAttributes, ReactNode } from 'react'
import {
  buttonClassName,
  type ButtonSize,
  type ButtonVariant,
} from './buttonStyles'

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
    <button className={buttonClassName(variant, size, className)} {...props}>
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
