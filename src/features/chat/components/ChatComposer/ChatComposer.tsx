import type { ChangeEvent, FormEvent } from 'react'
import sendIcon from '@/assets/chat/send.svg'

interface ChatComposerProps {
  readonly value: string
  readonly disabled?: boolean
  readonly error?: string
  readonly onChange: (value: string) => void
  readonly onSubmit: () => void
}

/** 질문 입력과 전송을 담당하는 챗봇 입력창 */
export function ChatComposer({
  value,
  disabled = false,
  error,
  onChange,
  onSubmit,
}: ChatComposerProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSubmit()
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onChange(event.currentTarget.value)
  }

  return (
    <div className="flex w-full flex-col gap-2">
      {error && (
        <p role="alert" className="px-5 text-body-sm text-error">
          {error}
        </p>
      )}
      <form
        className="flex h-[42px] items-center rounded-full bg-element px-5"
        onSubmit={handleSubmit}
      >
        <label htmlFor="chat-question" className="sr-only">
          AI 챗봇에게 질문하기
        </label>
        <input
          id="chat-question"
          name="question"
          type="text"
          autoComplete="off"
          value={value}
          disabled={disabled}
          onChange={handleChange}
          placeholder="무엇이든 질문하세요."
          className="min-w-0 flex-1 bg-transparent text-body-md text-gray-1000 outline-none placeholder:text-gray-300 disabled:cursor-wait"
        />
        <button
          type="submit"
          disabled={disabled || value.trim().length === 0}
          aria-label="질문 보내기"
          className="flex size-6 items-center justify-center focus-visible:rounded-full focus-visible:outline-2 focus-visible:outline-primary-500 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <img src={sendIcon} alt="" className="size-6" />
        </button>
      </form>
    </div>
  )
}
