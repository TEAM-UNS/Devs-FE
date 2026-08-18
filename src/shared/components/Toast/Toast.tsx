import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/shared/utils/cn'

export type ToastType = 'success' | 'warning' | 'error' | 'info'
type ToastSize = 'sm' | 'md'

interface ToastProps extends HTMLAttributes<HTMLDivElement> {
  /** 상태 종류 — 색·역할(alert/status)을 결정 (기본 'info') */
  type?: ToastType
  /** 크기 — 'md'(설명 가능) | 'sm'(pill, 타이틀만) (기본 'md') */
  size?: ToastSize
  /** 타이틀(주 메시지) */
  title: string
  /** 부가 설명 (md에서만 표시, 최대 2줄 권장) */
  description?: string
  /** 상태 아이콘 슬롯 (24px, 상태색 상속) */
  icon?: ReactNode
}

// 모듈 스코프 상수 (react-perf). 색은 Figma Toast(node 120:1768) 기준으로,
// bg=상태색 10% 틴트 · border·타이틀·아이콘=상태색. (Figma 변수 오류값 대신 렌더=우리 토큰 사용)
const TYPE_STYLES: Record<ToastType, string> = {
  success: 'border-success bg-success/10 text-success',
  warning: 'border-warning bg-warning/10 text-warning',
  error: 'border-error bg-error/10 text-error',
  info: 'border-info bg-info/10 text-info',
}

// 크기 — md는 라운드 사각형(설명 포함), sm은 pill(타이틀만). 치수는 Figma 값 그대로.
const SIZE_STYLES: Record<ToastSize, string> = {
  sm: 'rounded-full py-2 pl-4 pr-5',
  md: 'max-w-[450px] rounded-sm px-4 py-3',
}

// error·warning은 즉시 알림(assertive), 나머지는 정중한 알림(polite).
const ALERT_TYPES: ReadonlySet<ToastType> = new Set<ToastType>([
  'error',
  'warning',
])

/**
 * 일시적 피드백 토스트. 상태(type)에 따라 색과 접근성 역할이 바뀌며, md는 설명을,
 * sm은 pill 형태로 타이틀만 보여준다. 색·치수·타이포는 Figma "Toast" 컴포넌트를 구현했다.
 * 배치(fixed·z-toast)와 등장 애니메이션은 이 카드를 감싸는 뷰포트의 몫이다.
 *
 * @param props.type 상태 ('success' | 'warning' | 'error' | 'info', 기본 'info')
 * @param props.size 크기 ('md' | 'sm', 기본 'md')
 * @param props.title 타이틀(주 메시지)
 * @param props.description 부가 설명 (md에서만)
 * @param props.icon 상태 아이콘
 * @param props.className 추가로 병합할 클래스
 * @returns 상태색 테두리·틴트 배경의 토스트 카드
 */
export function Toast({
  type = 'info',
  size = 'md',
  title,
  description,
  icon,
  className,
  ...props
}: ToastProps) {
  return (
    <div
      role={ALERT_TYPES.has(type) ? 'alert' : 'status'}
      className={cn(
        'flex w-fit flex-col gap-2 border',
        TYPE_STYLES[type],
        SIZE_STYLES[size],
        className,
      )}
      {...props}
    >
      <div className="flex items-center gap-1.5">
        {icon && (
          <span
            className="inline-flex size-6 shrink-0 items-center justify-center"
            aria-hidden="true"
          >
            {icon}
          </span>
        )}
        <span className="text-body-md font-semibold">{title}</span>
      </div>
      {size === 'md' && description && (
        <p className="text-body-sm text-white/50">{description}</p>
      )}
    </div>
  )
}
