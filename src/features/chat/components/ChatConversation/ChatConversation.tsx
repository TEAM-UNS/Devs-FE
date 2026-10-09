import assistantDot from '@/assets/chat/assistant-dot.svg'
import messageTail from '@/assets/chat/message-tail.svg'
import type { ChatMessage } from '../../types/chat'
import { ChatMarkdown } from '../ChatMarkdown'
import { ChatSpinner } from '../ChatSpinner'

interface ChatConversationProps {
  readonly threadId: string
  readonly messages: readonly ChatMessage[]
  readonly pending: boolean
}

/** 사용자 질문과 챗봇 답변을 보여주는 대화 목록 */
export function ChatConversation({
  threadId,
  messages,
  pending,
}: ChatConversationProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const shouldFollowBottomRef = useRef(true)
  const previousThreadIdRef = useRef(threadId)

  useEffect(() => {
    if (previousThreadIdRef.current !== threadId) {
      previousThreadIdRef.current = threadId
      shouldFollowBottomRef.current = true
    }
    if (shouldFollowBottomRef.current) {
      bottomRef.current?.scrollIntoView?.({ block: 'end' })
    }
  }, [threadId, messages, pending])

  function handleScroll() {
    const scrollContainer = scrollContainerRef.current
    if (!scrollContainer) return

    const distanceFromBottom =
      scrollContainer.scrollHeight -
      scrollContainer.scrollTop -
      scrollContainer.clientHeight
    // 마지막 메시지에서 조금 벗어난 정도는 새 답변을 계속 따라가도록 허용
    shouldFollowBottomRef.current = distanceFromBottom <= 24
  }

  return (
    <div
      ref={scrollContainerRef}
      /* 스피너는 답변 점과 중심을 맞추려고 왼쪽으로 14px 나간다. 스크롤 영역은 넘치는 그림을 잘라서
         경계만 14px 바깥으로 빼고(-ml-3.5) 내용은 원래 자리에 둔다(pl-3.5).
         w-full이면 오른쪽 끝도 같이 당겨져 폭은 부모 flex의 stretch에 맡긴다 */
      className="scrollbar-slim -ml-3.5 flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto pl-3.5"
      aria-live="polite"
      onScroll={handleScroll}
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
            <ChatMarkdown content={message.content} />
          </div>
        ),
      )}
      {pending && (
        <div className="-ml-3.5 -mt-2">
          <ChatSpinner />
        </div>
      )}
      <div ref={bottomRef} aria-hidden="true" />
    </div>
  )
}
import { useEffect, useRef } from 'react'
