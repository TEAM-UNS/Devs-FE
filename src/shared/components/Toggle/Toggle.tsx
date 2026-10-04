import type { InputHTMLAttributes } from 'react'
import { cn } from '@/shared/utils/cn'

interface ToggleProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'size'
> {
  /** 스크린리더용 이름. 옆에 보이는 라벨이 따로 있으면 `aria-labelledby`를 써도 된다 */
  label?: string
  /** 루트 래퍼에 병합할 클래스 (레이아웃 조정용) */
  className?: string
}

/* 아래 상수는 모듈 스코프 — 렌더마다 새로 만들지 않는다 (react-perf).
   값은 Figma `toggle` 컴포넌트(node 659:4661) 기준이고, 세 변형의 렌더 색을 그대로 옮겼다.
   off 트랙 #1e2126→canvas · 노브 #ced4da→gray-500
   on  트랙 #aa5ef1→primary-400 · 노브 #f8f3fe→primary-900 · 그림자 #bc72f499
   비활성 트랙 #25292d→container · 노브 #343a40→element */
const TRACK_BASE = [
  'relative block h-6 w-12 rounded-full',
  'transition-colors duration-fast ease-standard',
  'peer-focus-visible:ring-2 peer-focus-visible:ring-primary-500',
  'peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-canvas',
].join(' ')

const TRACK_ENABLED = [
  'bg-canvas ring-1 ring-inset ring-gray-200',
  'peer-checked:bg-primary-400 peer-checked:ring-0',
  'peer-checked:shadow-[0_0_8px_0_#bc72f499]',
].join(' ')

const TRACK_DISABLED = 'bg-container'

// 노브 — 트랙 안에서 좌우로 움직인다. 20px 원이 양끝에서 2px씩 떨어진다.
const KNOB_BASE = [
  'pointer-events-none absolute top-0.5 left-0.5 size-5 rounded-full',
  'transition-[translate,background-color] duration-fast ease-standard',
  'peer-checked:translate-x-6',
].join(' ')

const KNOB_ENABLED = 'bg-gray-500 peer-checked:bg-primary-900'

const KNOB_DISABLED = 'bg-element'

/**
 * 켜고 끄는 스위치. 체크박스와 달리 "즉시 반영되는 설정"에 쓴다.
 *
 * 실제 `<input type="checkbox" role="switch">`라서 폼·키보드·스크린리더가 그대로 동작하고,
 * 트랙과 노브는 그 형제로 두어 `peer-checked`로 모양만 바꾼다.
 *
 * @param props.label 스크린리더용 이름
 * @param props.className 루트 래퍼에 병합할 클래스
 * @returns 스위치 역할의 `<label>` 엘리먼트
 */
export function Toggle({ label, className, disabled, ...props }: ToggleProps) {
  return (
    <label
      className={cn(
        'inline-flex shrink-0',
        disabled ? 'cursor-not-allowed' : 'cursor-pointer',
        className,
      )}
    >
      <input
        type="checkbox"
        role="switch"
        aria-label={label}
        disabled={disabled}
        className="peer sr-only"
        {...props}
      />
      <span
        aria-hidden="true"
        className={cn(TRACK_BASE, disabled ? TRACK_DISABLED : TRACK_ENABLED)}
      >
        <span
          className={cn(KNOB_BASE, disabled ? KNOB_DISABLED : KNOB_ENABLED)}
        />
      </span>
    </label>
  )
}
