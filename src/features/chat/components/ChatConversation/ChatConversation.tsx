import assistantDot from '@/assets/chat/assistant-dot.svg'
import messageTail from '@/assets/chat/message-tail.svg'
import type { ChatMessage } from '../../types/chat'
import { ChatSpinner } from '../ChatSpinner'

interface ChatConversationProps {
  readonly messages: readonly ChatMessage[]
  readonly pending: boolean
}

/** 사용자 질문과 챗봇 답변을 보여주는 대화 목록 */
export function ChatConversation({ messages, pending }: ChatConversationProps) {
  return (
    <div
      className="scrollbar-slim flex min-h-0 w-full flex-1 flex-col gap-6 overflow-y-auto"
      aria-live="polite"
    >
      {messages.map((message) =>
        message.role === 'user' ? (
          <div key={message.id} className="flex w-full justify-end">
            <div className="flex max-w-[621px] items-stretch">
              <p className="max-w-[600px] rounded-sm bg-element px-6 py-3 text-body-md text-gray-1000">
                {message.content}
              </p>
              <img src={messageTail} alt="" className="h-12 w-[21px]" />
            </div>
          </div>
        ) : (
          <div key={message.id} className="flex max-w-[624px] gap-4">
            <div className="flex py-1.5">
              <img src={assistantDot} alt="" className="size-2 shrink-0" />
            </div>
            <p className="text-body-md whitespace-pre-line text-gray-1000">
              {message.content}
            </p>
          </div>
        ),
      )}
      {pending && (
        <div className="-ml-3.5 -mt-2">
          <ChatSpinner />
        </div>
      )}
    </div>
  )
}
