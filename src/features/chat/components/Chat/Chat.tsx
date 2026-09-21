import { useRef, useState } from 'react'
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
  const [pendingThreadIds, setPendingThreadIds] = useState<ReadonlySet<string>>(
    () => new Set(),
  )
  const [deleteTargetId, setDeleteTargetId] = useState<string>()
  const [draftError, setDraftError] = useState<string>()
  const [threadErrors, setThreadErrors] = useState<ReadonlyMap<string, string>>(
    () => new Map(),
  )
  const deleteTriggerRef = useRef<HTMLButtonElement>(null)
  const newChatButtonRef = useRef<HTMLButtonElement>(null)
  const deletedThreadIdsRef = useRef<ReadonlySet<string>>(new Set())

  const activeThread = threads.find((thread) => thread.id === activeThreadId)

  async function handleSubmitQuestion(nextQuestion = question) {
    const trimmedQuestion = nextQuestion.trim()
    if (!trimmedQuestion) {
      setDraftError(EMPTY_QUESTION_ERROR)
      return
    }

    // 첫 질문이면 새 대화를 만들고 이후 질문은 현재 대화에 이어 붙임
    const threadId = activeThreadId ?? crypto.randomUUID()
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: trimmedQuestion,
    }

    setDraftError(undefined)
    setThreadErrors((currentErrors) => {
      const nextErrors = new Map(currentErrors)
      nextErrors.delete(threadId)
      return nextErrors
    })
    setQuestion('')
    setPendingThreadIds((currentIds) => new Set(currentIds).add(threadId))
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
      if (deletedThreadIdsRef.current.has(threadId)) return
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
      if (deletedThreadIdsRef.current.has(threadId)) return
      setThreadErrors((currentErrors) =>
        new Map(currentErrors).set(threadId, REQUEST_ERROR),
      )
    } finally {
      setPendingThreadIds((currentIds) => {
        const nextIds = new Set(currentIds)
        nextIds.delete(threadId)
        return nextIds
      })
    }
  }

  function handleStartNewChat() {
    setActiveThreadId(undefined)
    setQuestion('')
    setDraftError(undefined)
  }

  function handleDeleteThread() {
    if (!deleteTargetId) return

    setThreads((currentThreads) =>
      currentThreads.filter((thread) => thread.id !== deleteTargetId),
    )
    setActiveThreadId((currentThreadId) =>
      currentThreadId === deleteTargetId ? undefined : currentThreadId,
    )
    deletedThreadIdsRef.current = new Set(deletedThreadIdsRef.current).add(
      deleteTargetId,
    )
    setPendingThreadIds((currentIds) => {
      const nextIds = new Set(currentIds)
      nextIds.delete(deleteTargetId)
      return nextIds
    })
    setThreadErrors((currentErrors) => {
      const nextErrors = new Map(currentErrors)
      nextErrors.delete(deleteTargetId)
      return nextErrors
    })
    setDeleteTargetId(undefined)
  }

  function handleThreadSelect(threadId: string) {
    setActiveThreadId(threadId)
  }

  function handleDeleteRequest(threadId: string, trigger: HTMLButtonElement) {
    deleteTriggerRef.current = trigger
    setDeleteTargetId(threadId)
  }

  function handleDeleteCancel() {
    setDeleteTargetId(undefined)
  }

  const isActiveThreadPending = activeThreadId
    ? pendingThreadIds.has(activeThreadId)
    : false
  const activeThreadError = activeThreadId
    ? threadErrors.get(activeThreadId)
    : draftError

  return (
    <div className="flex h-full min-h-0 bg-canvas text-gray-1000">
      <div className="hidden h-full md:block">
        <ChatHistorySidebar
          threads={threads}
          activeThreadId={activeThreadId}
          onThreadSelect={handleThreadSelect}
          onThreadDelete={handleDeleteRequest}
          onNewChat={handleStartNewChat}
          newChatButtonRef={newChatButtonRef}
        />
      </div>
      {activeThread ? (
        <section className="flex min-w-0 flex-1 flex-col gap-4 overflow-hidden p-10">
          <ChatConversation
            threadId={activeThread.id}
            messages={activeThread.messages}
            pending={isActiveThreadPending}
          />
          <div className="mx-auto w-full max-w-[700px]">
            <ChatComposer
              value={question}
              disabled={isActiveThreadPending}
              error={activeThreadError}
              onChange={setQuestion}
              onSubmit={handleSubmitQuestion}
            />
          </div>
        </section>
      ) : (
        <ChatIntro
          question={question}
          error={draftError}
          onQuestionChange={setQuestion}
          onQuestionSubmit={handleSubmitQuestion}
          onSuggestionSelect={handleSubmitQuestion}
        />
      )}
      {deleteTargetId && (
        <ChatDeleteModal
          restoreFocusTo={deleteTriggerRef.current}
          fallbackFocusTo={newChatButtonRef.current}
          onCancel={handleDeleteCancel}
          onConfirm={handleDeleteThread}
        />
      )}
    </div>
  )
}
