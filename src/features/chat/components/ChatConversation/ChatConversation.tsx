import { useEffect, useRef, useState } from 'react'
import assistantDot from '@/assets/chat/assistant-dot.svg'
import messageTail from '@/assets/chat/message-tail.svg'
import { ChevronDownIcon } from '@/shared/components/icons'
import type { ChatMessage } from '../../types/chat'
import { ChatMarkdown } from '../ChatMarkdown'
import { ChatSpinner } from '../ChatSpinner'

interface ChatConversationProps {
  readonly threadId: string
  readonly messages: readonly ChatMessage[]
  readonly pending: boolean
}

// 마지막 메시지에서 조금 벗어난 정도는 맨 아래로 본다
const BOTTOM_THRESHOLD = 24

/** 사용자 질문과 챗봇 답변을 보여주는 대화 목록 */
export function ChatConversation({
  threadId,
  messages,
  pending,
}: ChatConversationProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const shouldFollowBottomRef = useRef(true)
  const lastScrollTopRef = useRef(0)
  const userMessageCount = messages.filter(
    (message) => message.role === 'user',
  ).length
  const previousRef = useRef({ threadId, userMessageCount })
  const [showsScrollButton, setShowsScrollButton] = useState(false)

  function scrollToBottom(behavior: ScrollBehavior = 'auto') {
    shouldFollowBottomRef.current = true
    bottomRef.current?.scrollIntoView?.({ block: 'end', behavior })
  }

  useEffect(() => {
    const previous = previousRef.current
    previousRef.current = { threadId, userMessageCount }

    // 다른 대화로 옮기면 바로 최신 메시지를 보여준다
    if (previous.threadId !== threadId) scrollToBottom()
    // 위로 올려 읽던 중이라도 질문을 보내면 내 질문까지 미끄러지듯 내려간다
    else if (userMessageCount > previous.userMessageCount)
      scrollToBottom('smooth')
    // 답변을 따라갈 때는 글자가 붙을 때마다 바로 맞춘다
    else if (shouldFollowBottomRef.current) scrollToBottom()
  }, [threadId, messages, pending, userMessageCount])

  function handleScroll() {
    const scrollContainer = scrollContainerRef.current
    if (!scrollContainer) return

    const { scrollTop, scrollHeight, clientHeight } = scrollContainer
    const isAtBottom =
      scrollHeight - scrollTop - clientHeight <= BOTTOM_THRESHOLD
    /* 위로 올렸을 때만 따라가기를 끈다. 거리만 보면 부드럽게 내려가는 도중에도
       맨 아래가 아니라서 꺼지고, 그 사이 도착한 답변을 놓친다 */
    if (isAtBottom) shouldFollowBottomRef.current = true
    else if (scrollTop < lastScrollTopRef.current)
      shouldFollowBottomRef.current = false
    lastScrollTopRef.current = scrollTop
    setShowsScrollButton(!shouldFollowBottomRef.current)
  }

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <div
        ref={scrollContainerRef}
        /* 스피너는 답변 점과 중심을 맞추려고 왼쪽으로 14px 나간다. 스크롤 영역은 넘치는 그림을 잘라서
           경계만 14px 바깥으로 빼고(-ml-3.5) 내용은 원래 자리에 둔다(pl-3.5).
           w-full이면 오른쪽 끝도 같이 당겨져 폭은 부모 flex의 stretch에 맡긴다 */
        className="scrollbar-slim -ml-3.5 flex min-h-0 flex-1 flex-col gap-12.5 overflow-y-auto pl-3.5"
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
            <div key={message.id} className="flex w-full gap-4">
              <div className="flex py-1.5">
                <img src={assistantDot} alt="" className="size-2 shrink-0" />
              </div>
              <ChatMarkdown content={message.content} />
            </div>
          ),
        )}
        {pending && (
          <div className="-ml-3.5 -mt-8.5">
            <ChatSpinner />
          </div>
        )}
        <div ref={bottomRef} aria-hidden="true" />
      </div>
      {/* 스크롤 영역 밖에 둬야 목록을 움직여도 입력창 바로 위에 붙어 있다 */}
      {showsScrollButton && (
        <button
          type="button"
          aria-label="최신 메시지로 이동"
          onClick={() => scrollToBottom('smooth')}
          className="absolute bottom-2 left-1/2 flex size-10 -translate-x-1/2 items-center justify-center rounded-full bg-element text-gray-1000 shadow-md focus-visible:outline-2 focus-visible:outline-primary-500"
        >
          <ChevronDownIcon className="size-6" />
        </button>
      )}
    </div>
  )
}
