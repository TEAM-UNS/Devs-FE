// @vitest-environment node
// fetch·Response·ReadableStream은 Node 기본 구현으로 돌린다 (브라우저와 같은 표준)
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { ChatSendRequest, ChatStreamEvent } from '../types/chatApi'
import { isChatStreamError, streamChat } from './streamChat'

const auth = vi.hoisted(() => ({
  token: 'old-token',
  refreshOnce: vi.fn<() => Promise<boolean>>(),
}))

vi.mock('@/shared/api', () => ({
  API_BASE_URL: 'https://api.test',
  getAccessToken: () => auth.token,
  refreshOnce: auth.refreshOnce,
}))

const encoder = new TextEncoder()

/** 바이트 덩어리들을 차례로 흘려보내는 SSE 응답 */
function sseResponse(chunks: Uint8Array[]): Response {
  const body = new ReadableStream<Uint8Array>({
    start(controller) {
      for (const chunk of chunks) controller.enqueue(chunk)
      controller.close()
    },
  })

  return new Response(body, {
    headers: { 'Content-Type': 'text/event-stream' },
  })
}

const text = (...chunks: string[]) =>
  sseResponse(chunks.map((chunk) => encoder.encode(chunk)))

const jsonError = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })

const fetchMock = vi.fn<typeof fetch>()

async function collect(request: ChatSendRequest = { message: '질문' }) {
  const events: ChatStreamEvent[] = []
  await streamChat(request, { onEvent: (event) => events.push(event) })
  return events
}

beforeEach(() => {
  auth.token = 'old-token'
  auth.refreshOnce.mockReset()
  fetchMock.mockReset()
  vi.stubGlobal('fetch', fetchMock)
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('streamChat', () => {
  it('토큰과 질문을 실어 POST로 보낸다', async () => {
    fetchMock.mockResolvedValue(text('event:done\ndata:{"message_id":1}\n\n'))

    await collect({ sessionId: 42, message: 'React 쓰는 회사는?' })

    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe('https://api.test/chat/messages')
    expect(init?.method).toBe('POST')
    expect(init?.headers).toMatchObject({
      Authorization: 'Bearer old-token',
      'Content-Type': 'application/json',
    })
    expect(JSON.parse(init?.body as string)).toEqual({
      sessionId: 42,
      message: 'React 쓰는 회사는?',
    })
  })

  it('조각에 나뉘어 온 이벤트를 완성되는 대로 순서대로 넘긴다', async () => {
    fetchMock.mockResolvedValue(
      text(
        'event:session\ndata:{"session_id":42,"is_new":true}\n\nevent:tok',
        'en\ndata:{"text":"React를 "}\n\n',
        'event:done\ndata:{"message_id":1}\n\n',
      ),
    )

    expect(await collect()).toEqual([
      { event: 'session', data: { session_id: 42, is_new: true } },
      { event: 'token', data: { text: 'React를 ' } },
      { event: 'done', data: { message_id: 1 } },
    ])
  })

  it('한글 한 글자의 바이트가 두 덩어리에 걸쳐 와도 깨지지 않는다', async () => {
    const bytes = encoder.encode(
      'event:token\ndata:{"text":"요"}\n\nevent:done\ndata:{"message_id":1}\n\n',
    )
    // "요"는 3바이트다. 그 가운데서 자른다
    const cut = bytes.indexOf(0xec) + 2

    fetchMock.mockResolvedValue(
      sseResponse([bytes.slice(0, cut), bytes.slice(cut)]),
    )

    expect((await collect())[0]).toEqual({
      event: 'token',
      data: { text: '요' },
    })
  })

  it('스트림 도중 error 이벤트는 던지지 않고 넘긴 뒤 끝난다', async () => {
    fetchMock.mockResolvedValue(
      text('event:error\ndata:AI 응답을 가져오지 못했습니다.\n\n'),
    )

    expect(await collect()).toEqual([
      {
        event: 'error',
        data: { message: 'AI 응답을 가져오지 못했습니다.' },
      },
    ])
  })

  it('done 없이 연결이 닫히면 중간에 끊긴 것으로 본다', async () => {
    fetchMock.mockResolvedValue(text('event:token\ndata:{"text":"React"}\n\n'))

    await expect(collect()).rejects.toThrow('답변이 중간에 끊겼습니다')
  })

  it('401이면 토큰을 재발급받고 새 토큰으로 한 번 다시 보낸다', async () => {
    auth.refreshOnce.mockImplementation(async () => {
      auth.token = 'new-token'
      return true
    })
    fetchMock
      .mockResolvedValueOnce(jsonError(401, { message: '만료' }))
      .mockResolvedValueOnce(text('event:done\ndata:{"message_id":1}\n\n'))

    await collect()

    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(fetchMock.mock.calls[1][1]?.headers).toMatchObject({
      Authorization: 'Bearer new-token',
    })
  })

  it('재발급도 실패하면 401 에러를 던진다', async () => {
    auth.refreshOnce.mockResolvedValue(false)
    fetchMock.mockResolvedValue(jsonError(401, { message: '만료' }))

    const error = await collect().catch((caught: unknown) => caught)

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(isChatStreamError(error)).toBe(true)
    expect(error).toMatchObject({ status: 401 })
  })

  it('스트림 시작 전 실패는 상태 코드와 서버 메시지를 담아 던진다', async () => {
    fetchMock.mockResolvedValue(
      jsonError(404, {
        status: 404,
        code: 'CHAT_SESSION_NOT_FOUND',
        message: '대화를 찾을 수 없습니다',
      }),
    )

    await expect(collect()).rejects.toMatchObject({
      name: 'ChatStreamError',
      status: 404,
      message: '대화를 찾을 수 없습니다',
    })
    expect(auth.refreshOnce).not.toHaveBeenCalled()
  })
})
