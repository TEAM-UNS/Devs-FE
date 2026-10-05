import { cn } from '@/shared/utils/cn'

export type ButtonVariant = 'primary' | 'outline' | 'ghost'
export type ButtonSize = 'sm' | 'md'

// 아래 상수는 모듈 스코프 — 렌더마다 새로 만들지 않는다 (react-perf).

// 공통 골격. 값은 Figma Button 컴포넌트(node 113:1213)에서 그대로 가져옴:
// gap 8px, radius 6px(number/6 → rounded-sm), 라벨 Pretendard SemiBold 16px/1.5.
// transition·focus 링은 Figma엔 없지만 상호작용 부드러움·a11y용으로 추가(모션 토큰 사용).
const BASE_STYLES = [
  'inline-flex items-center justify-center gap-2 rounded-sm',
  'text-body-md font-semibold whitespace-nowrap',
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
    // Figma outline/Disabled은 투명이 아니라 gray-200 채움 + gray-300 테두리다.
    'disabled:bg-gray-200 disabled:text-gray-300 disabled:ring-gray-300',
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

/**
 * 버튼 모양 클래스. 다른 경로로 보내는 컨트롤은 <button> 대신 링크여야 해서
 * (새 탭 열기·주소 복사) 링크에도 같은 모양을 입힐 수 있게 꺼내 둔다
 */
export function buttonClassName(
  variant: ButtonVariant = 'primary',
  size: ButtonSize = 'md',
  className?: string,
) {
  return cn(BASE_STYLES, VARIANT_STYLES[variant], SIZE_STYLES[size], className)
}
