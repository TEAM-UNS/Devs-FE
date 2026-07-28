import type { HTMLAttributes, ReactNode } from 'react'
import { CloseIcon } from '@/shared/components/icons'
import { cn } from '@/shared/utils/cn'

type ChipSize = 'default' | 'small'

interface ChipProps extends HTMLAttributes<HTMLElement> {
  /** 크기 — 'default'(h32·16px) | 'small'(h24·14px) (기본 'default') */
  size?: ChipSize
  /**
   * 선택 상태. 값을 주면 토글 칩(필터)이 되어 `<button aria-pressed>`로 렌더된다.
   * true=강조(보라·글로우), false=평소(회색). 생략하면 정적/추가·삭제 칩으로 취급.
   */
  selected?: boolean
  /** 라벨 앞 16px 아이콘 슬롯 (태그 '#', 추가 '+', 체크 '✓' 등) */
  icon?: ReactNode
  /** 삭제 콜백 — 주면 라벨 뒤에 전용 삭제 `<button>`(× 아이콘)이 붙는다 (Input Chip) */
  onRemove?: () => void
  /** 삭제 버튼의 접근성 라벨 (기본 '삭제') */
  removeLabel?: string
}

// 아래 상수는 모듈 스코프 — 렌더마다 새로 만들지 않는다 (react-perf).

// 공통 골격. 값은 Figma Chip/Filter/Input 컴포넌트에서 그대로:
// radius full(pill), gap 4px(space/4), px 12px(space/12), Pretendard Regular.
// transition·focus 링은 Figma엔 없지만 상호작용·a11y용으로 추가(모션 토큰 사용).
const BASE_STYLES = [
  'inline-flex items-center gap-1 rounded-full px-3',
  'whitespace-nowrap',
  'transition-colors duration-fast ease-standard',
].join(' ')

// 키보드 포커스 링 (a11y). 상호작용 요소(토글 칩·삭제 버튼)에만 적용.
const FOCUS_RING =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500'

// 크기 — 높이·텍스트 스케일만 다르다(패딩·gap·아이콘은 두 크기 공통).
const SIZE_STYLES: Record<ChipSize, string> = {
  default: 'h-8 text-body-md', // 32px / 16px(body-medium)
  small: 'h-6 text-body-sm', // 24px / 14px(body-small)
}

// 선택 상태색 — off는 element보다 밝은 gray-200 배경·gray-400 텍스트,
// on은 primary-500 배경·흰 텍스트에 보라 글로우. (Figma 변수명은 primary/500이지만
// 렌더 hex #bc72f4 = 우리 primary-500. 글로우 = primary-500 60% blur 4px.)
const SELECTED_STYLES = 'bg-primary-500 text-white'
const SELECTED_GLOW = 'drop-shadow-[0_0_4px_rgba(188,114,244,0.6)]'
const UNSELECTED_STYLES = 'bg-gray-200 text-gray-400'

// 아이콘 슬롯 — Figma 기준 16px 정사각. 아이콘 색은 칩 텍스트 색을 상속.
const ICON_SLOT = 'inline-flex size-4 shrink-0 items-center justify-center'

// 삭제 버튼 — 자체 <button>. 텍스트 색 상속, hover 시 살짝 흐려진다.
const REMOVE_BUTTON = [
  ICON_SLOT,
  'rounded-full text-current',
  'transition-opacity duration-fast ease-standard hover:opacity-70',
  FOCUS_RING,
].join(' ')

// 삭제 아이콘(×). currentColor로 칩 텍스트 색을 상속한다. 모듈 스코프 JSX(react-perf).
const REMOVE_ICON = <CloseIcon className="size-full" />

/**
 * 공용 칩. 태그·필터·입력(추가/삭제) 칩을 하나의 API로 통합한 pill 요소다.
 * `selected`를 주면 토글 가능한 필터 칩(`<button aria-pressed>`)이 되고, `onRemove`를
 * 주면 라벨 뒤에 삭제 버튼이 붙는 입력 칩이 된다. 그 외에는 정적 태그(`<span>`)로 렌더된다.
 * 색·치수·타이포는 Figma "Chip/Filter Chip/Input Chip" 컴포넌트를 그대로 구현했다(다크 서피스).
 *
 * @param props.size 크기 ('default'=32 | 'small'=24, 기본 'default')
 * @param props.selected 선택 상태 (주면 토글 칩, true=보라·글로우 / false=회색)
 * @param props.icon 라벨 앞 16px 아이콘 (#, +, ✓ 등)
 * @param props.onRemove 삭제 콜백 (주면 라벨 뒤 삭제 버튼 표시)
 * @param props.removeLabel 삭제 버튼 접근성 라벨 (기본 '삭제')
 * @param props.onClick 칩 클릭 콜백 (토글/추가 칩에서 사용)
 * @param props.className 추가로 병합할 클래스
 * @returns 상황에 따라 `<button>`(상호작용) 또는 `<span>`(정적)으로 렌더된 칩
 */
export function Chip({
  size = 'default',
  selected,
  icon,
  onRemove,
  removeLabel = '삭제',
  className,
  children,
  onClick,
  ...props
}: ChipProps) {
  const removable = onRemove != null
  // 삭제 칩이 아니면서 토글(selected)이거나 클릭 가능하면 칩 전체가 버튼이다.
  // (삭제 칩은 내부에 삭제 <button>이 있어 중첩 방지를 위해 <span> 컨테이너로 둔다.)
  const interactive = !removable && (selected !== undefined || onClick != null)

  const rootClassName = cn(
    BASE_STYLES,
    SIZE_STYLES[size],
    selected ? cn(SELECTED_STYLES, SELECTED_GLOW) : UNSELECTED_STYLES,
    className,
  )

  const body = (
    <>
      {icon && (
        <span className={ICON_SLOT} aria-hidden="true">
          {icon}
        </span>
      )}
      {children}
      {onRemove && (
        <button
          type="button"
          aria-label={removeLabel}
          onClick={onRemove}
          className={REMOVE_BUTTON}
        >
          {REMOVE_ICON}
        </button>
      )}
    </>
  )

  if (interactive) {
    return (
      <button
        type="button"
        aria-pressed={selected}
        onClick={onClick}
        className={cn(rootClassName, FOCUS_RING)}
        {...props}
      >
        {body}
      </button>
    )
  }

  return (
    <span className={rootClassName} {...props}>
      {body}
    </span>
  )
}
