import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AxiosError, type AxiosResponse } from 'axios'
import { MemoryRouter, useLocation } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type {
  ChatMessageDto,
  ChatSendRequest,
  ChatSessionDto,
  ChatStreamEvent,
} from '@/features/chat/types/chatApi'
import { renderWithQuery } from '@/test/renderWithQuery'
import ChatPage from './ChatPage'

/* 메모리 위의 가짜 서버. 목록·기록 조회와 전송이 같은 데이터를 본다 */
const server = vi.hoisted(() => ({
  sessions: [] as ChatSessionDto[],
  messages: new Map<number, ChatMessageDto[]>(),
  nextId: 1,
}))

const { trackEvent, streamChat } = vi.hoisted(() => ({
  trackEvent: vi.fn(),
  streamChat: vi.fn(),
}))

vi.mock('@/shared/analytics', () => ({ trackEvent, trackPageView: vi.fn() }))

const notFound = () =>
  new AxiosError('not found', 'ERR_BAD_REQUEST', undefined, undefined, {
    status: 404,
    data: { message: '대화를 찾을 수 없습니다' },
  } as AxiosResponse)

vi.mock('@/shared/api/http', () => ({
  get: vi.fn((path: string) => {
    if (path === '/chat/sessions') {
      return Promise.resolve({ sessions: [...server.sessions] })
    }
    const sessionId = Number(
      /^\/chat\/sessions\/(\d+)\/messages$/.exec(path)?.[1],
    )
    const messages = server.messages.get(sessionId)
    if (messages) {
      const title = server.sessions.find(({ id }) => id === sessionId)?.title
      return Promise.resolve({ sessionId, title, messages: [...messages] })
    }
    return Promise.reject(notFound())
  }),
  post: vi.fn(),
}))

vi.mock('@/features/chat/api/streamChat', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/features/chat/api/streamChat')>()),
  streamChat,
}))

type Emit = (event: ChatStreamEvent) => void

/** 서버처럼 질문을 저장하고, 새 대화면 id를 만들어 session 이벤트로 알린다 */
function openTurn(request: ChatSendRequest, emit: Emit) {
  const sessionId = request.sessionId ?? server.nextId++
  if (request.sessionId === undefined) {
    server.sessions.unshift({ id: sessionId, title: null, lastMessageAt: '' })
    server.messages.set(sessionId, [])
  }
  server.messages
    .get(sessionId)
    ?.push({ id: Date.now(), role: 'user', content: request.message })
  emit({
    event: 'session',
    data: { session_id: sessionId, is_new: request.sessionId === undefined },
  })
  return sessionId
}

/** 질문마다 answer를 토큰 두 조각으로 나눠 보내고, 새 대화면 질문을 제목으로 붙인다 */
function answerWith(answer: string) {
  streamChat.mockImplementation(
    async (request: ChatSendRequest, { onEvent }: { onEvent: Emit }) => {
      const sessionId = openTurn(request, onEvent)
      const half = Math.ceil(answer.length / 2)
      onEvent({ event: 'token', data: { text: answer.slice(0, half) } })
      onEvent({ event: 'token', data: { text: answer.slice(half) } })

      if (request.sessionId === undefined) {
        const session = server.sessions.find(({ id }) => id === sessionId)
        if (session) session.title = request.message
        onEvent({ event: 'title', data: { title: request.message } })
      }
      server.messages
        .get(sessionId)
        ?.push({ id: Date.now() + 1, role: 'assistant', content: answer })
      onEvent({ event: 'done', data: { message_id: 1 } })
    },
  )
}

/** 지금 주소의 쿼리스트링을 화면에 적어 둔다 — URL 반영을 확인하는 창구 */
function SearchProbe() {
  return <output data-testid="search">{useLocation().search}</output>
}

function renderPage(entry = '/chat') {
  return renderWithQuery(
    <MemoryRouter initialEntries={[entry]}>
      <ChatPage />
      <SearchProbe />
    </MemoryRouter>,
  )
}

const input = () =>
  screen.getByRole('textbox', { name: 'AI 챗봇에게 질문하기' })

async function ask(question: string) {
  const user = userEvent.setup()
  await user.type(input(), question)
  await user.click(screen.getByRole('button', { name: '질문 보내기' }))
}

describe('ChatPage', () => {
  beforeEach(() => {
    server.sessions = []
    server.messages = new Map()
    server.nextId = 1
    trackEvent.mockReset()
    streamChat.mockReset()
    answerWith('채용 공고 기반 답변입니다.')
  })

  it('renders the empty chat screen from the design', async () => {
    renderPage()

    expect(screen.getByRole('link', { name: '메인페이지' })).toHaveAttribute(
      'href',
      '/dashboard',
    )
    expect(await screen.findByText('최근 대화가 없습니다.')).toBeInTheDocument()
    expect(input()).toHaveAttribute('autocomplete', 'off')
    expect(input()).toHaveAttribute('placeholder', '무엇이든 질문하세요.')
    expect(
      screen.getByRole('button', { name: '백엔드 중 가장 인기있는 기술 스택' }),
    ).toBeInTheDocument()
  })

  it('새 대화로 질문하면 답변을 이어 붙여 보여주고, 생긴 대화를 주소와 목록에 남긴다', async () => {
    renderPage()

    await ask('로드맵 생성 기준은 무엇인가요?')

    expect(
      await screen.findByText('채용 공고 기반 답변입니다.'),
    ).toBeInTheDocument()
    expect(streamChat).toHaveBeenCalledWith(
      { sessionId: undefined, message: '로드맵 생성 기준은 무엇인가요?' },
      expect.anything(),
    )
    expect(screen.getByTestId('search')).toHaveTextContent('?session=1')
    // 사이드바 제목 + 대화 속 질문
    expect(screen.getAllByText('로드맵 생성 기준은 무엇인가요?')).toHaveLength(
      2,
    )
  })

  it('이어서 묻는 질문은 지금 대화의 id로 보낸다', async () => {
    renderPage()

    await ask('첫 질문')
    await screen.findByText('채용 공고 기반 답변입니다.')
    await ask('이어서 묻는 질문')

    await waitFor(() =>
      expect(streamChat).toHaveBeenLastCalledWith(
        { sessionId: 1, message: '이어서 묻는 질문' },
        expect.anything(),
      ),
    )
    expect(await screen.findByText('이어서 묻는 질문')).toBeInTheDocument()
  })

  it('추천 질문과 직접 입력을 구분해 전송 이벤트를 남긴다', async () => {
    const user = userEvent.setup()
    renderPage()

    await user.click(
      screen.getByRole('button', { name: '백엔드 중 가장 인기있는 기술 스택' }),
    )
    expect(trackEvent).toHaveBeenCalledWith('Chat Question Sent', {
      is_suggested: true,
      is_follow_up: false,
    })

    await screen.findByText('채용 공고 기반 답변입니다.')
    await ask('이어서 묻는 질문')

    expect(trackEvent).toHaveBeenLastCalledWith('Chat Question Sent', {
      is_suggested: false,
      is_follow_up: true,
    })
  })

  it('주소의 대화 id로 서버 기록을 불러온다', async () => {
    server.sessions = [{ id: 7, title: '지난 대화', lastMessageAt: '' }]
    server.messages.set(7, [
      { id: 1, role: 'user', content: '지난 질문' },
      { id: 2, role: 'assistant', content: '지난 답변' },
    ])
    renderPage('/chat?session=7')

    expect(await screen.findByText('지난 답변')).toBeInTheDocument()
    expect(screen.getByText('지난 질문')).toBeInTheDocument()
  })

  it('제목이 아직 없는 대화는 임시 제목으로 보여준다', async () => {
    server.sessions = [{ id: 3, title: null, lastMessageAt: '' }]
    server.messages.set(3, [])
    renderPage()

    expect(
      await screen.findByRole('button', { name: '새 대화' }),
    ).toBeInTheDocument()
  })

  it('없는 대화를 주소로 열면 새 대화 화면으로 돌린다', async () => {
    renderPage('/chat?session=999')

    expect(await screen.findByAltText('Devs')).toBeInTheDocument()
    expect(screen.getByTestId('search')).toHaveTextContent('')
  })

  it('starts a new empty chat while keeping the previous thread', async () => {
    const user = userEvent.setup()
    renderPage()

    await user.click(
      screen.getByRole('button', { name: '백엔드 중 가장 인기있는 기술 스택' }),
    )
    await screen.findByText('채용 공고 기반 답변입니다.')
    await user.click(screen.getByRole('button', { name: '새 대화 시작' }))

    expect(screen.getByAltText('Devs')).toBeInTheDocument()
    // 사이드바의 지난 대화 + 새 화면의 추천 질문
    expect(
      screen.getAllByRole('button', {
        name: '백엔드 중 가장 인기있는 기술 스택',
      }),
    ).toHaveLength(2)
  })

  it('deletes a chat after confirming the Figma modal', async () => {
    const user = userEvent.setup()
    renderPage()

    await user.click(
      screen.getByRole('button', { name: '백엔드 중 가장 인기있는 기술 스택' }),
    )
    await screen.findByText('채용 공고 기반 답변입니다.')
    await user.click(
      screen.getByRole('button', {
        name: '백엔드 중 가장 인기있는 기술 스택 삭제',
      }),
    )

    expect(
      screen.getByRole('dialog', { name: '정말 이 채팅을 삭제하시겠습니까?' }),
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: '삭제' }))

    expect(screen.getByText('최근 대화가 없습니다.')).toBeInTheDocument()
    expect(screen.getByAltText('Devs')).toBeInTheDocument()
  })

  it('keeps the chat when deletion is cancelled', async () => {
    const user = userEvent.setup()
    renderPage()

    await user.click(
      screen.getByRole('button', { name: '최근 한달 간 급하락중인 기술 스택' }),
    )
    await screen.findByText('채용 공고 기반 답변입니다.')
    await user.click(
      screen.getByRole('button', {
        name: '최근 한달 간 급하락중인 기술 스택 삭제',
      }),
    )
    await user.click(screen.getByRole('button', { name: '취소' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(
      screen.getByRole('button', {
        name: '최근 한달 간 급하락중인 기술 스택 삭제',
      }),
    ).toBeInTheDocument()
  })

  it('스트림 도중 error 이벤트가 오면 코드에 맞는 문구를 보여주고 입력창은 비운다', async () => {
    streamChat.mockImplementation(
      async (request: ChatSendRequest, { onEvent }: { onEvent: Emit }) => {
        openTurn(request, onEvent)
        onEvent({
          event: 'error',
          data: {
            code: 'LLM_UNAVAILABLE',
            message: '답변 생성에 실패했습니다.',
            recoverable: true,
          },
        })
      },
    )
    renderPage()

    await ask('오류 테스트')

    expect(await screen.findByRole('alert')).toHaveTextContent(
      '답변 생성에 실패했습니다. 잠시 후 다시 시도해 주세요.',
    )
    // 서버가 질문을 받았으니 기록에 남고, 입력창에는 되돌리지 않는다
    expect(input()).toHaveValue('')
  })

  it('스트림이 시작되기 전에 실패하면 질문을 입력창에 되돌린다', async () => {
    streamChat.mockRejectedValue(
      Object.assign(new Error('rate limited'), {
        name: 'ChatStreamError',
        status: 429,
      }),
    )
    renderPage()

    await ask('다시 보낼 질문')

    expect(await screen.findByRole('alert')).toHaveTextContent(
      '질문이 너무 많습니다. 잠시 후 다시 시도해 주세요.',
    )
    expect(input()).toHaveValue('다시 보낼 질문')
  })

  it('shows an error above the composer when the response fails', async () => {
    streamChat.mockRejectedValue(new Error('failed'))
    renderPage()

    await ask('오류 테스트')

    expect(await screen.findByRole('alert')).toHaveTextContent(
      '답변을 불러오지 못했습니다. 다시 시도해 주세요.',
    )
  })

  it('shows the Figma spinner while waiting for a response', async () => {
    streamChat.mockReturnValue(new Promise(() => undefined))
    const user = userEvent.setup()
    renderPage()

    await user.click(
      screen.getByRole('button', { name: '로드맵 생성 기준은 무엇인가요?' }),
    )

    expect(
      screen.getByRole('status', { name: '답변 생성 중' }),
    ).toBeInTheDocument()
  })

  it('답변을 받는 동안에는 새 대화에서도 질문할 수 없다', async () => {
    streamChat.mockImplementation(
      (request: ChatSendRequest, { onEvent }: { onEvent: Emit }) => {
        openTurn(request, onEvent)
        return new Promise(() => undefined)
      },
    )
    const user = userEvent.setup()
    renderPage()

    await user.click(
      screen.getByRole('button', { name: '백엔드 중 가장 인기있는 기술 스택' }),
    )
    await user.click(
      await screen.findByRole('button', { name: '새 대화 시작' }),
    )

    expect(input()).toBeDisabled()
    expect(
      screen.getByRole('button', { name: '최근 한달 간 급하락중인 기술 스택' }),
    ).toBeDisabled()
  })

  it('restores focus to the delete button after closing the modal', async () => {
    const user = userEvent.setup()
    renderPage()

    await user.click(
      screen.getByRole('button', { name: '최근 한달 간 급하락중인 기술 스택' }),
    )
    await screen.findByText('채용 공고 기반 답변입니다.')
    const deleteButton = screen.getByRole('button', {
      name: '최근 한달 간 급하락중인 기술 스택 삭제',
    })

    await user.click(deleteButton)
    expect(screen.getByRole('button', { name: '삭제 모달 닫기' })).toHaveFocus()

    await user.keyboard('{Escape}')
    expect(deleteButton).toHaveFocus()
  })

  it('moves focus to new chat after deleting the focused thread', async () => {
    const user = userEvent.setup()
    renderPage()

    await user.click(
      screen.getByRole('button', { name: '로드맵 생성 기준은 무엇인가요?' }),
    )
    await screen.findByText('채용 공고 기반 답변입니다.')
    await user.click(
      screen.getByRole('button', {
        name: '로드맵 생성 기준은 무엇인가요? 삭제',
      }),
    )
    await user.click(screen.getByRole('button', { name: '삭제' }))

    expect(screen.getByRole('button', { name: '새 대화 시작' })).toHaveFocus()
  })
})
