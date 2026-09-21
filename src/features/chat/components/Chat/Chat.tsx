import { useState } from 'react'
import { requestMockChatReply } from '../../api/mockChat'
import type { ChatMessage, ChatThread } from '../../types/chat'
import { ChatDeleteModal } from '../ChatDeleteModal'
import { ChatComposer } from '../ChatComposer'
import { ChatConversation } from '../ChatConversation'
import { ChatHistorySidebar } from '../ChatHistorySidebar'
import { ChatIntro } from '../ChatIntro'

const EMPTY_QUESTION_ERROR = '질문을 입력해 주세요.'
const REQUEST_ERROR = '답변을 불러오지 못했습니다. 다시 시도해 주세요.'

/** 챗봇 대화 상태와 화면을 연결 */
export function Chat() {
  const [question, setQuestion] = useState('')
  const [threads, setThreads] = useState<readonly ChatThread[]>([])
  const [activeThreadId, setActiveThreadId] = useState<string>()
  const [pendingThreadId, setPendingThreadId] = useState<string>()
  const [deleteTargetId, setDeleteTargetId] = useState<string>()
  const [error, setError] = useState<string>()

  const activeThread = threads.find((thread) => thread.id === activeThreadId)

  async function handleSubmitQuestion(nextQuestion = question) {
    const trimmedQuestion = nextQuestion.trim()
    if (!trimmedQuestion) {
      setError(EMPTY_QUESTION_ERROR)
      return
    }

    // 첫 질문이면 새 대화를 만들고 이후 질문은 현재 대화에 이어 붙임
    const threadId = activeThreadId ?? crypto.randomUUID()
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: trimmedQuestion,
    }

    setError(undefined)
    setQuestion('')
    setPendingThreadId(threadId)
    setActiveThreadId(threadId)
    // 응답을 기다리는 동안 질문이 바로 보이도록 먼저 대화에 기록
    setThreads((currentThreads) => {
      const currentThread = currentThreads.find(
        (thread) => thread.id === threadId,
      )
      if (currentThread) {
        return currentThreads.map((thread) =>
          thread.id === threadId
            ? { ...thread, messages: [...thread.messages, userMessage] }
            : thread,
        )
      }
      return [
        ...currentThreads,
        {
          id: threadId,
          title: trimmedQuestion,
          messages: [userMessage],
        },
      ]
    })

    try {
      const reply = await requestMockChatReply(trimmedQuestion)
      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: reply,
      }
      setThreads((currentThreads) =>
        currentThreads.map((thread) =>
          // 응답 중 다른 대화를 선택해도 요청을 시작한 대화에 답변을 남김
          thread.id === threadId
            ? {
                ...thread,
                messages: [...thread.messages, assistantMessage],
              }
            : thread,
        ),
      )
    } catch {
      setError(REQUEST_ERROR)
    } finally {
      // 먼저 시작한 요청이 다른 대화의 대기 상태를 해제하지 않도록 요청 대상을 확인
      setPendingThreadId((currentThreadId) =>
        currentThreadId === threadId ? undefined : currentThreadId,
      )
    }
  }

  function handleStartNewChat() {
    setActiveThreadId(undefined)
    setQuestion('')
    setError(undefined)
  }

  function handleDeleteThread() {
    if (!deleteTargetId) return

    setThreads((currentThreads) =>
      currentThreads.filter((thread) => thread.id !== deleteTargetId),
    )
    setActiveThreadId((currentThreadId) =>
      currentThreadId === deleteTargetId ? undefined : currentThreadId,
    )
    setPendingThreadId((currentThreadId) =>
      currentThreadId === deleteTargetId ? undefined : currentThreadId,
    )
    setDeleteTargetId(undefined)
    setError(undefined)
  }

  function handleThreadSelect(threadId: string) {
    setActiveThreadId(threadId)
  }

  function handleDeleteRequest(threadId: string) {
    setDeleteTargetId(threadId)
  }

  function handleDeleteCancel() {
    setDeleteTargetId(undefined)
  }

  const isActiveThreadPending = pendingThreadId === activeThreadId

  return (
    <div className="flex h-full min-h-0 bg-canvas text-gray-1000">
      <ChatHistorySidebar
        threads={threads}
        activeThreadId={activeThreadId}
        onThreadSelect={handleThreadSelect}
        onThreadDelete={handleDeleteRequest}
        onNewChat={handleStartNewChat}
      />
      {activeThread ? (
        <section className="flex min-w-0 flex-1 flex-col gap-4 overflow-hidden p-10">
          <ChatConversation
            messages={activeThread.messages}
            pending={isActiveThreadPending}
          />
          <div className="mx-auto w-full max-w-[700px]">
            <ChatComposer
              value={question}
              disabled={isActiveThreadPending}
              error={error}
              onChange={setQuestion}
              onSubmit={handleSubmitQuestion}
            />
          </div>
        </section>
      ) : (
        <ChatIntro
          question={question}
          error={error}
          onQuestionChange={setQuestion}
          onQuestionSubmit={handleSubmitQuestion}
          onSuggestionSelect={handleSubmitQuestion}
        />
      )}
      {deleteTargetId && (
        <ChatDeleteModal
          onCancel={handleDeleteCancel}
          onConfirm={handleDeleteThread}
        />
      )}
    </div>
  )
}
