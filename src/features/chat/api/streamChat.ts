import { API_BASE_URL, getAccessToken, refreshOnce } from '@/shared/api'
import type { ChatSendRequest, ChatStreamEvent } from '../types/chatApi'
import { parseEventBlock, splitEventBlocks } from '../utils/sseParser'

const SEND_PATH = '/chat/messages'

const STREAM_ERROR_NAME = 'ChatStreamError'

/** 스트림 시작 전 실패는 status가 있고, 중간에 끊긴 경우는 status가 없다 */
export type ChatStreamError = Error & { status?: number }

/** 스트림을 받지 못했거나 중간에 끊겼을 때 던질 에러. name으로 다른 에러와 구분한다 */
function chatStreamError(message: string, status?: number): ChatStreamError {
  return Object.assign(new Error(message), { name: STREAM_ERROR_NAME, status })
}

/** catch로 받은 값이 우리 스트림 에러인지. 화면이 status로 문구를 고를 때 쓴다 */
export function isChatStreamError(error: unknown): error is ChatStreamError {
  return error instanceof Error && error.name === STREAM_ERROR_NAME
}

interface StreamChatOptions {
  /** 이벤트가 하나 완성될 때마다 불린다 */
  onEvent: (event: ChatStreamEvent) => void
  /** abort()하면 요청과 스트림 읽기가 AbortError로 멈춘다 */
  signal?: AbortSignal
}

/**
 * 질문을 보내고 답변을 SSE로 받는다
 *
 * 브라우저 EventSource는 GET만 되고 헤더·본문을 못 실어서 fetch로 보내고 본문 스트림을 직접 읽는다
 * 스트림 도중의 error 이벤트는 던지지 않고 onEvent로 넘긴다. 화면이 문구로 보여줄 일이라서다
 *
 * @throws ChatStreamError 스트림 시작 전 실패(상태 코드 포함) 또는 done 없이 끊김
 * @throws AbortError signal로 중단했을 때
 */
export async function streamChat(
  request: ChatSendRequest,
  { onEvent, signal }: StreamChatOptions,
): Promise<void> {
  const response = await openStream(request, signal)
  await readEvents(response, onEvent)
}

/** 요청을 보내고, 스트림을 읽을 수 있는 응답이 올 때까지 처리한다 */
async function openStream(
  request: ChatSendRequest,
  signal?: AbortSignal,
): Promise<Response> {
  let response = await send(request, signal)

  // 토큰이 만료됐으면 axios 요청과 같은 재발급을 거쳐 한 번만 다시 보낸다
  if (response.status === 401 && (await refreshOnce())) {
    response = await send(request, signal)
  }

  // fetch는 4xx·5xx에도 에러를 던지지 않는다. 스트림 시작 전 실패라 본문은 평범한 JSON 에러다
  if (!response.ok) {
    throw chatStreamError(await readServerMessage(response), response.status)
  }

  return response
}

function send(request: ChatSendRequest, signal?: AbortSignal) {
  // 재시도할 때 재발급된 토큰을 실어야 해서 보낼 때마다 새로 읽는다
  const accessToken = getAccessToken()

  return fetch(`${API_BASE_URL}${SEND_PATH}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'text/event-stream',
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    },
    body: JSON.stringify(request),
    signal,
  })
}

/** 비즈니스 에러는 `{ message }`로 온다. 본문이 없거나 모양이 다르면 상태 코드만 남긴다 */
async function readServerMessage(response: Response): Promise<string> {
  // 본문이 JSON이 아니면(앞단 프록시의 HTML 에러 페이지 등) 상태 코드만 남긴다
  const body: unknown = await response.json().catch(() => null)
  const { message } = (body ?? {}) as { message?: unknown }

  return typeof message === 'string' ? message : `HTTP ${response.status}`
}

/** 본문 스트림을 끝까지 읽으며 완성된 이벤트를 onEvent로 넘긴다 */
async function readEvents(
  response: Response,
  onEvent: StreamChatOptions['onEvent'],
): Promise<void> {
  if (!response.body) throw chatStreamError('응답 본문이 없습니다')

  const reader = response.body.getReader()
  // 반복문 밖에서 한 번만 만든다. 덩어리 끝에 걸린 한글 바이트를 들고 있다가 다음 덩어리와 합친다
  const decoder = new TextDecoder()
  let buffer = ''
  let finished = false

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    // ① 바이트 → 글자. 덩어리 끝의 반쪽 글자는 decoder가 들고 있다
    const text = decoder.decode(value, { stream: true })
    // ② 글자 → 이벤트. 덜 끝난 이벤트는 다음 덩어리를 위해 buffer에 남긴다
    const { blocks, rest } = splitEventBlocks(buffer + text)
    buffer = rest

    for (const block of blocks) {
      const event = parseEventBlock(block)
      if (!event) continue

      onEvent(event)
      if (event.event === 'done' || event.event === 'error') finished = true
    }
  }

  // 서버는 done이나 error를 보낸 뒤 연결을 닫는다. 둘 다 없이 닫혔으면 중간에 끊긴 것이다
  if (!finished) throw chatStreamError('답변이 중간에 끊겼습니다')
}
