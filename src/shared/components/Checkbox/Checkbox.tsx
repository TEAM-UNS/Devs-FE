import type { InputHTMLAttributes, ReactNode } from 'react'
import { useEffect, useId, useRef } from 'react'
import { cn } from '@/shared/utils/cn'

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  /** 박스 오른쪽 라벨(타이틀). 없으면 박스만 렌더한다 */
  label?: ReactNode
  /** 라벨 아래 부가 설명 (label과 함께 쓸 때만 의미가 있다) */
  description?: ReactNode
  /** 부분 선택 상태 — 실제 `<input>.indeterminate`에 반영된다 (기본 false) */
  indeterminate?: boolean
  /** 루트 래퍼(label)에 병합할 클래스 (레이아웃·너비 조정용) */
  className?: string
}

// 아래 상수는 모듈 스코프 — 렌더마다 새로 만들지 않는다 (react-perf).
//
// 구조: relative 래퍼 안에 input(peer)·박스·마크를 "모두 형제"로 둔다.
// peer-checked/peer-indeterminate 변형은 peer(input)의 형제에만 적용되므로,
// 마크를 박스 자식으로 중첩하면 안 먹는다 → 마크도 형제로 두고 absolute로 겹친다.

// 박스 — relative 래퍼를 채우는 24px 정사각, radius 6px(rounded-sm). 값은 Figma
// "Checkbox" 컴포넌트(node 125:994) 기준. off는 gray-200 테두리(투명 채움),
// on/indeterminate는 primary-400 채움. (렌더 hex: #bc72f4→primary-400, #495057→gray-200)
const BOX_BASE = [
  'absolute inset-0 rounded-sm border',
  'transition-colors duration-fast ease-standard',
  'peer-focus-visible:ring-2 peer-focus-visible:ring-primary-400',
  'peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-canvas',
].join(' ')

const BOX_ENABLED = [
  'border-gray-200 bg-transparent',
  'peer-checked:border-transparent peer-checked:bg-primary-400',
  'peer-indeterminate:border-transparent peer-indeterminate:bg-primary-400',
].join(' ')

// 비활성 — 선택 여부와 무관하게 gray-200 채움. (Figma 렌더 hex: 박스 #495057→gray-200)
const BOX_DISABLED = 'border-transparent bg-gray-200'

// 마크(체크·대시) — input의 형제로 두고 박스(24px) 위에 absolute로 겹친다. 색은 래퍼의
// currentColor를 상속(활성 흰색 / 비활성 gray-300).
// 채움 path는 Figma Checkbox 컴포넌트에서 export한 것으로, 24px 박스 안 원래 크기 그대로
// 가운데 둔다(체크 12.4607×8.86945 / 대시 10×1.5).
const MARK_BASE = 'pointer-events-none absolute inset-0 hidden size-6'

// 체크는 선택 시, 대시는 부분 선택 시에만. CSS로 제어하므로 비제어 입력도 반영된다.
const CHECK_MARK = (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    fill="none"
    className={cn(MARK_BASE, 'peer-checked:block peer-indeterminate:hidden')}
  >
    <path
      transform="translate(5.7697 7.5653)"
      d="M4.18982 7.38883L11.3886 0.190079C11.5125 0.0660513 11.6575 0.00271806 11.8236 7.91668e-05C11.9897 -0.00255972 12.1374 0.0607735 12.2667 0.190079C12.396 0.319385 12.4607 0.467857 12.4607 0.635496C12.4607 0.803274 12.396 0.951814 12.2667 1.08112L4.71712 8.64362C4.56642 8.79418 4.39066 8.86945 4.18982 8.86945C3.98899 8.86945 3.81323 8.79418 3.66253 8.64362L0.183367 5.16445C0.0594777 5.04043 -0.00163348 4.8932 3.31858e-05 4.72279C0.00156096 4.55251 0.0669776 4.40272 0.196283 4.27341C0.325589 4.14411 0.474061 4.07945 0.6417 4.07945C0.809478 4.07945 0.958019 4.14411 1.08732 4.27341L4.18982 7.38883Z"
      fill="currentColor"
    />
  </svg>
)

const INDETERMINATE_MARK = (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    fill="none"
    className={cn(MARK_BASE, 'peer-indeterminate:block')}
  >
    <path
      transform="translate(7 11.25)"
      d="M9.51613 0C9.78336 0 10 0.335786 10 0.75C10 1.16421 9.78336 1.5 9.51613 1.5H0.483871C0.216636 1.5 0 1.16421 0 0.75C0 0.335786 0.216636 0 0.483871 0H9.51613Z"
      fill="currentColor"
    />
  </svg>
)

/**
 * 공용 체크박스. 실제 `<input type="checkbox">`(시각적 숨김)를 두어 접근성·키보드·폼 동작을 그대로
 * 유지하고, 그 옆의 스타일 박스가 선택/부분선택/비활성 상태를 시각적으로 표현한다. 색·치수·타이포는
 * Figma "Checkbox" 컴포넌트(상태 default/disabled × 선택 off/on/Indeterminate)를 그대로 구현했고
 * 디자인 토큰에 매핑돼 있다(다크 서피스 기준). 선택 시각은 CSS(`peer-checked`/`peer-indeterminate`)로
 * 구동하므로 제어·비제어(`checked`/`defaultChecked`) 모두 정확히 반영된다.
 *
 * @param props.label 박스 오른쪽 타이틀 (label ↔ input 연결은 자동 처리)
 * @param props.description 라벨 아래 부가 설명 (aria-describedby로 연결)
 * @param props.indeterminate 부분 선택 상태 (input.indeterminate에 반영, 기본 false)
 * @param props.className 루트 래퍼(label)에 병합할 클래스
 * @returns 라벨·설명을 포함할 수 있는 접근성 체크박스
 */
export function Checkbox({
  label,
  description,
  indeterminate = false,
  id,
  className,
  disabled,
  ...props
}: CheckboxProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const generatedId = useId()
  const inputId = id ?? generatedId
  const labelId = `${inputId}-label`
  const descriptionId = `${inputId}-description`

  // indeterminate는 HTML 속성이 아니라 DOM 프로퍼티라서 ref로 직접 설정한다.
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate
    }
  }, [indeterminate])

  return (
    <label
      className={cn(
        'inline-flex items-start gap-1.5',
        disabled ? 'cursor-not-allowed' : 'cursor-pointer',
        className,
      )}
    >
      <span
        className={cn(
          'relative size-6 shrink-0',
          disabled ? 'text-gray-300' : 'text-white',
        )}
      >
        <input
          {...props}
          ref={inputRef}
          type="checkbox"
          id={inputId}
          disabled={disabled}
          aria-labelledby={label ? labelId : undefined}
          aria-describedby={description ? descriptionId : undefined}
          className="peer sr-only"
        />
        <span className={cn(BOX_BASE, disabled ? BOX_DISABLED : BOX_ENABLED)} />
        {CHECK_MARK}
        {INDETERMINATE_MARK}
      </span>
      {(label || description) && (
        <span className="flex min-w-0 flex-col gap-1">
          {label && (
            <span
              id={labelId}
              className={cn(
                'text-body-md font-semibold',
                disabled ? 'text-gray-300' : 'text-white',
              )}
            >
              {label}
            </span>
          )}
          {description && (
            <span
              id={descriptionId}
              className={cn(
                'text-body-sm',
                disabled ? 'text-gray-200' : 'text-gray-300',
              )}
            >
              {description}
            </span>
          )}
        </span>
      )}
    </label>
  )
}
