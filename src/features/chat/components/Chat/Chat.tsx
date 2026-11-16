import { useEffect, useRef, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import { trackEvent } from '@/shared/analytics'
import { SidebarDrawer } from '@/shared/components/AppSidebar'
import { MenuIcon } from '@/shared/components/icons'
import { useMediaQuery } from '@/shared/hooks/useMediaQuery'
import { chatQueries, streamChat } from '../../api'
import { useDeleteChatSession } from '../../hooks/useDeleteChatSession'
import type { ChatMessage, ChatThread } from '../../types/chat'
import type {
  ChatSessionListResponse,
  ChatStreamEvent,
} from '../../types/chatApi'
import { ChatDeleteModal } from '../ChatDeleteModal'
import { ChatComposer } from '../ChatComposer'
import { ChatConversation } from '../ChatConversation'
import { ChatHistorySidebar } from '../ChatHistorySidebar'
import { ChatIntro } from '../ChatIntro'
import {
  streamErrorMessage,
  thrownErrorMessage,
} from '../../utils/chatErrorMessage'
import { isNotFound } from '../../utils/isNotFound'

const EMPTY_QUESTION_ERROR = '질문을 입력해 주세요.'
/* 제목은 첫 답변 중에 따로 만들어져서 그 전이나 생성이 실패하면 null이다. 디자인 확정 전 임시 문구 */
const UNTITLED = '새 대화'

/** 지금 보는 대화를 URL에 둔다 — 새로고침·뒤로가기가 같은 대화로 돌아온다 */
const SESSION_PARAM = 'session'

/** 답변을 받고 있는 한 턴. 끝나면 서버 기록으로 대체되고 사라진다 */
interface ChatTurn {
  /** 새 대화의 첫 질문이면 session 이벤트가 오기 전까지 없다 */
  readonly sessionId?: number
  readonly question: string
  readonly answer: string
  /** AI가 지금 쓰는 도구 문구. 다음 글자가 오면 지운다 */
  readonly toolLabel?: string
}

/** 턴이 실패했을 때 어느 대화에 띄울 문구인지. 새 대화에서 실패하면 sessionId가 없다 */
interface TurnError {
  readonly sessionId?: number
  readonly message: string
}

function parseSessionId(value: string | null): number | undefined {
  const id = Number(value)
  return Number.isInteger(id) && id > 0 ? id : undefined
}

/** 챗봇 대화 상태와 화면을 연결 */
export function Chat() {
  const queryClient = useQueryClient()
  const [searchParams, setSearchParams] = useSearchParams()
  const urlSessionId = parseSessionId(searchParams.get(SESSION_PARAM))
  /* 새 대화가 생기면 주소를 바꾸는데, 라우터는 주소 변경을 transition으로 늦게 반영한다.
     그 사이 한 프레임 동안 턴의 대화 id와 주소가 어긋나 인트로가 끼어들고 스피너가 끊겨 보여서,
     주소가 따라올 때까지 새 id를 먼저 쓴다 (주간 리포트의 pendingWeek과 같은 이유) */
  const [pendingSessionId, setPendingSessionId] = useState<number>()
  const activeSessionId = pendingSessionId ?? urlSessionId

  const [question, setQuestion] = useState('')
  const [draftError, setDraftError] = useState<string>()
  /* 한 번에 한 질문만 보낸다. 진행 중인 턴이 있으면 모든 입력창을 막는다 */
  const [turn, setTurn] = useState<ChatTurn>()
  const [turnError, setTurnError] = useState<TurnError>()
  /* 삭제를 누르면 서버 응답 전에 목록에서 먼저 뺀다. 실패하면 다시 넣는다 */
  const [hiddenSessionIds, setHiddenSessionIds] = useState<ReadonlySet<number>>(
    () => new Set(),
  )
  const [deleteTargetId, setDeleteTargetId] = useState<number>()
  const deleteTriggerRef = useRef<HTMLButtonElement>(null)
  const newChatButtonRef = useRef<HTMLButtonElement>(null)
  const abortRef = useRef<AbortController>(null)
  /* 1024px 미만은 대화 목록을 햄버거로 여는 서랍에 넣는다 (다른 화면의 앱 메뉴 서랍과 같은 동작).
     목록을 화면에 한 번만 그려야 새 대화 버튼 ref가 보이는 쪽을 가리켜서, CSS로 숨기지 않고 폭을 본다 */
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  const sessions = useQuery(chatQueries.sessions())
  const deleteSession = useDeleteChatSession()
  /* 답변을 받는 동안에는 그 대화의 기록을 다시 부르지 않는다. 서버에 이미 저장된 질문이
     기록으로 와서 턴의 질문과 두 번 보이기 때문이다. 답변이 끝나면 새로 불러온다 */
  const isTurnSession = turn !== undefined && turn.sessionId === activeSessionId
  const history = useQuery({
    ...chatQueries.messages(activeSessionId ?? 0),
    enabled: activeSessionId !== undefined && !isTurnSession,
  })

  useEffect(() => {
    if (pendingSessionId !== undefined && urlSessionId === pendingSessionId) {
      setPendingSessionId(undefined)
    }
  }, [pendingSessionId, urlSessionId])

  // 페이지를 떠나면 받던 답변도 끊는다. 서버는 거기까지 쓴 답변을 저장한다
  useEffect(() => () => abortRef.current?.abort(), [])

  // 없거나 남의 대화(404)를 URL로 열면 새 대화 화면으로 돌린다
  useEffect(() => {
    if (!isNotFound(history.error)) return

    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current)
        next.delete(SESSION_PARAM)
        return next
      },
      { replace: true },
    )
  }, [history.error, setSearchParams])

  function openSession(sessionId?: number, options?: { replace?: boolean }) {
    setSearchParams((current) => {
      const next = new URLSearchParams(current)
      if (sessionId === undefined) next.delete(SESSION_PARAM)
      else next.set(SESSION_PARAM, String(sessionId))
      return next
    }, options)
  }

  function refreshSessions() {
    return queryClient.invalidateQueries({
      queryKey: chatQueries.sessions().queryKey,
    })
  }

  /* 제목 이벤트는 답변 도중 아무 때나 온다. 목록을 다시 부르지 않고 캐시의 제목만 바꾼다 */
  function setSessionTitle(sessionId: number, title: string) {
    queryClient.setQueryData<ChatSessionListResponse>(
      chatQueries.sessions().queryKey,
      (current) =>
        current && {
          sessions: current.sessions.map((session) =>
            session.id === sessionId ? { ...session, title } : session,
          ),
        },
    )
  }

  async function handleSubmitQuestion(
    nextQuestion = question,
    source: 'composer' | 'suggestion' = 'composer',
  ) {
    const trimmedQuestion = nextQuestion.trim()
    if (!trimmedQuestion) {
      setDraftError(EMPTY_QUESTION_ERROR)
      return
    }
    if (turn) return

    // 질문 내용은 수집하지 않고 추천 질문을 썼는지, 사용자가 직접 입력 했는지, 이어서 계속 질문 했는지 이벤트 수집
    trackEvent('Chat Question Sent', {
      is_suggested: source === 'suggestion',
      is_follow_up: activeSessionId !== undefined,
    })

    const controller = new AbortController()
    abortRef.current = controller
    /* 새 대화면 session 이벤트로 id가 정해진다. 이벤트 처리 중에 바로 써야 해서 지역 변수로 든다 */
    let sessionId = activeSessionId
    let errorMessage: string | undefined
    /* 이벤트를 하나라도 받았으면 서버가 질문을 받은 것이다. 하나도 없이 실패했으면
       질문이 저장되지 않았으니 다시 보낼 수 있게 입력창에 되돌린다 */
    let received = false

    setQuestion('')
    setDraftError(undefined)
    setTurnError(undefined)
    setTurn({ sessionId, question: trimmedQuestion, answer: '' })

    function handleEvent(event: ChatStreamEvent) {
      received = true
      switch (event.event) {
        case 'session':
          sessionId = event.data.session_id
          setTurn((current) => current && { ...current, sessionId })
          if (event.data.is_new) {
            // 새 대화가 생겼으니 주소와 사이드바에 바로 보이게 한다
            setPendingSessionId(sessionId)
            openSession(sessionId, { replace: true })
            void refreshSessions()
          }
          break
        case 'title':
          if (sessionId !== undefined)
            setSessionTitle(sessionId, event.data.title)
          break
        case 'tool_start':
          setTurn(
            (current) => current && { ...current, toolLabel: event.data.label },
          )
          break
        case 'token':
          setTurn(
            (current) =>
              current && {
                ...current,
                answer: current.answer + event.data.text,
                toolLabel: undefined,
              },
          )
          break
        case 'error':
          errorMessage = streamErrorMessage(event.data)
          break
      }
    }

    try {
      await streamChat(
        { sessionId, message: trimmedQuestion },
        { signal: controller.signal, onEvent: handleEvent },
      )
    } catch (error) {
      errorMessage = thrownErrorMessage(error)
    }

    // 사용자가 떠나거나 대화를 지워서 끊은 것은 실패가 아니고, 화면도 이미 정리됐다
    if (controller.signal.aborted) return

    if (errorMessage) setTurnError({ sessionId, message: errorMessage })
    if (errorMessage && !received) setQuestion(trimmedQuestion)
    await finishTurn(sessionId)
  }

  /* 서버에 저장된 기록을 받아 온 뒤에 턴을 지운다. 먼저 지우면 기록이 오기 전 한순간
     질문과 답변이 사라졌다 다시 나타난다. 실패했어도 서버가 거기까지 저장했을 수 있다 */
  async function finishTurn(sessionId?: number) {
    if (sessionId !== undefined) {
      await queryClient
        .fetchQuery({ ...chatQueries.messages(sessionId), staleTime: 0 })
        .catch(() => undefined)
    }
    void refreshSessions()
    setTurn(undefined)
    abortRef.current = null
  }

  function handleStartNewChat() {
    openSession(undefined)
    setQuestion('')
    setDraftError(undefined)
  }

  function handleDeleteThread() {
    if (deleteTargetId === undefined) return

    const sessionId = deleteTargetId
    setHiddenSessionIds((current) => new Set(current).add(sessionId))
    deleteSession.mutate(sessionId, {
      onError: () =>
        setHiddenSessionIds((current) => {
          const next = new Set(current)
          next.delete(sessionId)
          return next
        }),
    })
    if (turn?.sessionId === deleteTargetId) {
      abortRef.current?.abort()
      setTurn(undefined)
    }
    if (turnError?.sessionId === deleteTargetId) setTurnError(undefined)
    if (activeSessionId === deleteTargetId) openSession(undefined)
    setDeleteTargetId(undefined)
  }

  function handleDeleteRequest(threadId: number, trigger: HTMLButtonElement) {
    // 삭제 확인 창은 서랍(top layer) 아래에 깔려 누를 수 없어서 서랍을 먼저 닫는다
    setMenuOpen(false)
    deleteTriggerRef.current = trigger
    setDeleteTargetId(threadId)
  }

  const threads: ChatThread[] = (sessions.data?.sessions ?? [])
    .filter((session) => !hiddenSessionIds.has(session.id))
    .map((session) => ({ id: session.id, title: session.title ?? UNTITLED }))

  /* 새 대화의 첫 질문은 session 이벤트 전까지 id가 없어, 새 대화 화면에서 그 턴을 보여준다 */
  const showsTurn = turn !== undefined && turn.sessionId === activeSessionId
  const messages: ChatMessage[] = [
    ...(history.data?.messages ?? []).map((message) => ({
      id: String(message.id),
      role: message.role,
      content: message.content,
    })),
    ...(showsTurn
      ? [
          {
            id: 'turn-question',
            role: 'user' as const,
            content: turn.question,
          },
          ...(turn.answer
            ? [
                {
                  id: 'turn-answer',
                  role: 'assistant' as const,
                  content: turn.answer,
                },
              ]
            : []),
        ]
      : []),
  ]
  /* 첫 글자가 오기 전, 답변 도중 도구를 쓰는 동안, 기록을 불러오는 동안 답변 스피너를 보여준다
     답변을 보여주는 동안엔 기록 로딩을 보지 않는다. 새 대화는 기록 캐시가 비어 있어
     답변이 끝나고 기록을 다시 받는 동안 isLoading이 켜지고 스피너가 잠깐 다시 보인다 */
  const toolLabel = showsTurn ? turn.toolLabel : undefined
  const pending = showsTurn
    ? !turn.answer || toolLabel !== undefined
    : history.isLoading
  // 둘 다 undefined(새 대화 화면, 에러 없음)일 때 같다고 보지 않도록 turnError부터 확인한다
  const activeError =
    turnError && turnError.sessionId === activeSessionId
      ? turnError.message
      : undefined
  const showsConversation = activeSessionId !== undefined || showsTurn

  const sidebar = (
    <ChatHistorySidebar
      threads={threads}
      activeThreadId={activeSessionId}
      // 서랍에서 대화를 고르거나 새 대화를 시작하면 화면이 바뀌므로 서랍을 닫는다
      onThreadSelect={(sessionId) => {
        setMenuOpen(false)
        openSession(sessionId)
      }}
      onThreadDelete={handleDeleteRequest}
      onNewChat={() => {
        setMenuOpen(false)
        handleStartNewChat()
      }}
      newChatButtonRef={newChatButtonRef}
    />
  )

  return (
    <div className="flex h-full min-h-0 bg-canvas text-gray-1000">
      {isDesktop && <div className="h-full">{sidebar}</div>}
      {/* 1024px 미만 여백은 Figma 패드·모바일 모두 위아래 80 · 좌우 32 (2339:15323 · 2339:15364).
          햄버거 바로 아래부터 내용이 시작한다 */}
      <div className="flex min-w-0 flex-1 flex-col px-8 py-20 lg:p-0">
        <button
          ref={menuButtonRef}
          type="button"
          aria-label="대화 목록 열기"
          aria-haspopup="dialog"
          onClick={() => setMenuOpen(true)}
          className="flex size-6 shrink-0 text-white focus-visible:outline-2 focus-visible:outline-primary-500 lg:hidden"
        >
          <MenuIcon className="size-full" />
        </button>
        {showsConversation ? (
          <section className="flex min-h-0 min-w-0 flex-1 flex-col gap-4 overflow-hidden lg:p-10">
            <div className="mx-auto flex min-h-0 w-[800px] max-w-full flex-1 flex-col gap-4">
              <ChatConversation
                threadId={String(activeSessionId ?? 'new')}
                messages={messages}
                pending={pending}
                pendingLabel={toolLabel}
              />
              <ChatComposer
                value={question}
                disabled={turn !== undefined}
                error={activeError ?? draftError}
                onChange={setQuestion}
                onSubmit={handleSubmitQuestion}
              />
            </div>
          </section>
        ) : (
          <ChatIntro
            question={question}
            disabled={turn !== undefined}
            error={activeError ?? draftError}
            onQuestionChange={setQuestion}
            onQuestionSubmit={handleSubmitQuestion}
            onSuggestionSelect={(selected) =>
              handleSubmitQuestion(selected, 'suggestion')
            }
          />
        )}
      </div>
      {/* 넓은 화면으로 바뀌면 open이 false가 돼 서랍이 닫히고 목록은 왼쪽 자리로 옮겨 간다 */}
      <SidebarDrawer
        open={menuOpen && !isDesktop}
        onClose={() => setMenuOpen(false)}
      >
        {!isDesktop && sidebar}
      </SidebarDrawer>
      {deleteTargetId !== undefined && (
        <ChatDeleteModal
          // 서랍에서 지웠다면 누른 버튼이 닫힌 서랍 안에 있어 햄버거로 돌려준다
          restoreFocusTo={
            isDesktop ? deleteTriggerRef.current : menuButtonRef.current
          }
          fallbackFocusTo={
            isDesktop ? newChatButtonRef.current : menuButtonRef.current
          }
          onCancel={() => setDeleteTargetId(undefined)}
          onConfirm={handleDeleteThread}
        />
      )}
    </div>
  )
}
