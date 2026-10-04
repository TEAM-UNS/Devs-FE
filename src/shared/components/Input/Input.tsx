import type { InputHTMLAttributes, ReactNode } from 'react'
import { useId } from 'react'
import { cn } from '@/shared/utils/cn'
import { XCircleIcon } from '@/shared/components/icons'

type InputState = 'default' | 'error' | 'success'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** 상단 레이블 (없으면 미표시) */
  label?: string
  /** 시각 상태 — 테두리·메시지 색을 결정 (기본 'default') */
  state?: InputState
  /** 필드 하단 메시지 (헬퍼/에러/성공 문구) */
  message?: string
  /** 메시지 앞 16px 아이콘 (상태별 아이콘 등) */
  messageIcon?: ReactNode
  /** 필드 오른쪽 20px 아이콘 슬롯 (비밀번호 토글 등) */
  trailingIcon?: ReactNode
  /** 필드 오른쪽 타이머 텍스트 (예: 인증 제한시간) */
  timer?: ReactNode
  /** 루트 래퍼에 병합할 클래스 (레이아웃·너비 조정용) */
  className?: string
}

// 모듈 스코프 상수 (react-perf). 값은 Figma "input" 컴포넌트(node 113:1086) 기준:
// 필드 bg=element, radius 6px(rounded-sm), h48, px16. 테두리는 상태에 따라 색만 바뀐다.
const FIELD_BASE = [
  'flex h-12 w-full items-center gap-2 rounded-sm border px-4',
  'transition-colors duration-fast ease-standard',
].join(' ')

// 상태별 테두리 — default는 평소 투명·포커스 시 gray-300, error/success는 항상 색 테두리.
const STATE_BORDER: Record<InputState, string> = {
  default: 'border-transparent focus-within:border-gray-300',
  error: 'border-error',
  success: 'border-success',
}

// 메시지 텍스트 색 — 상태와 동일 계열.
const MESSAGE_COLOR: Record<InputState, string> = {
  default: 'text-gray-300',
  error: 'text-error',
  success: 'text-success',
}

const ICON_SLOT = 'inline-flex shrink-0 items-center justify-center'

// state="error"일 때 메시지 앞에 자동으로 붙는 기본 아이콘.
const ERROR_ICON = <XCircleIcon className="size-full" />

/**
 * 공용 텍스트 입력 필드. 레이블·필드·메시지로 구성되며 상태(default/error/success)에 따라
 * 테두리와 메시지 색이 바뀐다. 색·치수·타이포는 Figma "input" 컴포넌트를 그대로 구현했고,
 * 표준 `<input>` 속성을 그대로 받는다(다크 서피스 기준).
 *
 * @param props.label 상단 레이블 (레이블-입력 연결은 자동 처리)
 * @param props.state 시각 상태 ('default' | 'error' | 'success', 기본 'default')
 * @param props.message 하단 메시지 문구
 * @param props.messageIcon 메시지 앞 아이콘
 * @param props.trailingIcon 필드 오른쪽 아이콘
 * @param props.timer 필드 오른쪽 타이머 텍스트
 * @param props.className 루트 래퍼에 병합할 클래스
 * @returns 레이블·필드·메시지를 포함한 입력 필드
 */
export function Input({
  label,
  state = 'default',
  message,
  messageIcon,
  trailingIcon,
  timer,
  id,
  className,
  disabled,
  ...props
}: InputProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const messageId = `${inputId}-message`
  // 에러 상태면 메시지 앞에 기본 에러 아이콘을 자동 노출 (명시 messageIcon이 우선).
  const resolvedMessageIcon =
    messageIcon ?? (state === 'error' ? ERROR_ICON : undefined)

  return (
    <div className={cn('flex w-full flex-col gap-1', className)}>
      <div className="flex w-full flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-body-md text-white">
            {label}
          </label>
        )}
        <div
          className={cn(
            FIELD_BASE,
            disabled
              ? 'border-transparent bg-container'
              : cn('bg-element', STATE_BORDER[state]),
          )}
        >
          <input
            id={inputId}
            disabled={disabled}
            aria-invalid={state === 'error' || undefined}
            aria-describedby={message ? messageId : undefined}
            className={cn(
              'min-w-0 flex-1 bg-transparent text-body-md text-white outline-none',
              'placeholder:text-gray-300',
              'disabled:cursor-not-allowed disabled:text-element disabled:placeholder:text-element',
            )}
            {...props}
          />
          {(timer || trailingIcon) && (
            <div className="flex shrink-0 items-center gap-0.5">
              {timer && (
                <span
                  className={cn(
                    'text-body-md',
                    disabled ? 'text-element' : 'text-primary-500',
                  )}
                >
                  {timer}
                </span>
              )}
              {trailingIcon && (
                <span className={cn(ICON_SLOT, 'size-5')}>{trailingIcon}</span>
              )}
            </div>
          )}
        </div>
      </div>
      {message && (
        <div id={messageId} className="flex items-center gap-0.5">
          {resolvedMessageIcon && (
            <span
              className={cn(ICON_SLOT, 'size-4', MESSAGE_COLOR[state])}
              aria-hidden="true"
            >
              {resolvedMessageIcon}
            </span>
          )}
          <span className={cn('text-body-xs', MESSAGE_COLOR[state])}>
            {message}
          </span>
        </div>
      )}
    </div>
  )
}
