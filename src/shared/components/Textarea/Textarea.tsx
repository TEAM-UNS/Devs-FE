import type { ReactNode, TextareaHTMLAttributes } from 'react'
import { useId } from 'react'
import { cn } from '@/shared/utils/cn'

type TextareaState = 'default' | 'error' | 'success'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** 상단 레이블 (없으면 미표시) */
  label?: string
  /** 시각 상태 — 테두리·메시지 색을 결정 (기본 'default') */
  state?: TextareaState
  /** 필드 하단 메시지 (헬퍼/에러/성공 문구) */
  message?: string
  /** 메시지 앞 16px 아이콘 (상태별 아이콘 등) */
  messageIcon?: ReactNode
  /** 루트 래퍼에 병합할 클래스 (레이아웃·너비 조정용) */
  className?: string
}

// 모듈 스코프 상수 (react-perf). 값은 Figma "input > Textarea"(node 113:1204) 기준:
// 필드 bg=element, radius 6px(rounded-sm), px16 py8, 내용 상단 정렬. 높이는 콘텐츠에 따라
// 유동(field-sizing-content 자동 확장, min-h로 최소 높이 보장). Input과 같은 상태 체계를 공유.
const FIELD_BASE = [
  'field-sizing-content min-h-24 w-full resize-none rounded-sm border px-4 py-2',
  'text-body-md text-white outline-none placeholder:text-gray-300',
  'transition-colors duration-fast ease-standard',
  'disabled:cursor-not-allowed disabled:text-element disabled:placeholder:text-element',
].join(' ')

// 상태별 테두리 — default는 평소 투명·포커스 시 gray-300, error/success는 항상 색 테두리.
const STATE_BORDER: Record<TextareaState, string> = {
  default: 'border-transparent focus:border-gray-300',
  error: 'border-error',
  success: 'border-success',
}

// 메시지 텍스트 색 — 상태와 동일 계열.
const MESSAGE_COLOR: Record<TextareaState, string> = {
  default: 'text-gray-300',
  error: 'text-error',
  success: 'text-success',
}

const ICON_SLOT = 'inline-flex size-4 shrink-0 items-center justify-center'

/**
 * 공용 멀티라인 입력(textarea). 레이블·필드·메시지로 구성되며 상태(default/error/success)에 따라
 * 테두리와 메시지 색이 바뀐다. 내용은 상단 정렬되고 높이는 콘텐츠에 따라 유동적으로 늘어난다.
 * 색·치수·타이포는 Figma "Textarea"를 구현했고 Input과 동일한 상태 체계를 공유한다(다크 서피스).
 *
 * @param props.label 상단 레이블 (레이블-입력 연결은 자동 처리)
 * @param props.state 시각 상태 ('default' | 'error' | 'success', 기본 'default')
 * @param props.message 하단 메시지 문구
 * @param props.messageIcon 메시지 앞 아이콘
 * @param props.className 루트 래퍼에 병합할 클래스
 * @returns 레이블·필드·메시지를 포함한 멀티라인 입력
 */
export function Textarea({
  label,
  state = 'default',
  message,
  messageIcon,
  id,
  className,
  disabled,
  ...props
}: TextareaProps) {
  const generatedId = useId()
  const fieldId = id ?? generatedId
  const messageId = `${fieldId}-message`

  return (
    <div className={cn('flex w-full flex-col gap-1', className)}>
      <div className="flex w-full flex-col gap-1.5">
        {label && (
          <label htmlFor={fieldId} className="text-body-md text-white">
            {label}
          </label>
        )}
        <textarea
          id={fieldId}
          disabled={disabled}
          aria-invalid={state === 'error' || undefined}
          aria-describedby={message ? messageId : undefined}
          className={cn(
            FIELD_BASE,
            disabled
              ? 'border-transparent bg-container'
              : cn('bg-element', STATE_BORDER[state]),
          )}
          {...props}
        />
      </div>
      {message && (
        <div id={messageId} className="flex items-center gap-0.5">
          {messageIcon && (
            <span className={ICON_SLOT} aria-hidden="true">
              {messageIcon}
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
