import type { ChatStreamEvent } from '../types/chatApi'

/** SSE에서 이벤트 하나의 끝을 뜻하는 빈 줄 */
const EVENT_BOUNDARY = '\n\n'

/** 채팅 화면에서 쓰는 이벤트. 여기 없는 이벤트(graph·tool_start 등)는 건너뛴다 */
const CHAT_EVENTS: readonly string[] = [
  'session',
  'title',
  'token',
  'done',
  'error',
] satisfies ChatStreamEvent['event'][]

/**
 * 버퍼에서 완성된 이벤트 블록을 잘라 내고, 아직 덜 온 뒷부분을 돌려준다
 *
 * 네트워크 조각은 이벤트 경계와 상관없이 잘려 온다. 빈 줄이 이벤트 하나의 끝이므로
 * 빈 줄 앞까지만 블록으로 내보내고, 그 뒤는 다음 조각과 합치도록 rest로 남긴다
 *
 * @param buffer 지금까지 받은 문자열 (이전 rest + 새 조각)
 * @returns blocks: 완성된 이벤트 블록들 (줄바꿈은 `\n`), rest: 다음 조각을 기다릴 나머지
 */
export function splitEventBlocks(buffer: string): {
  blocks: string[]
  rest: string
} {
  // 표준은 \r\n 줄바꿈도 허용한다. \n 하나로 맞춰야 빈 줄을 한 가지 모양으로 찾을 수 있다
  const parts = buffer.replaceAll('\r\n', '\n').split(EVENT_BOUNDARY)

  // 마지막 조각은 빈 줄로 끝나지 않은 부분이다. 버퍼가 빈 줄로 끝났다면 빈 문자열이 남는다
  const rest = parts.pop() ?? ''

  return { blocks: parts, rest }
}

/**
 * 이벤트 블록 하나를 ChatStreamEvent로 바꾼다. 쓰지 않는 이벤트면 null
 *
 * 블록은 `필드이름:값` 줄들이다. `event` 줄이 종류, `data` 줄이 JSON 내용이다
 *
 * @param block splitEventBlocks가 잘라 낸 블록 하나
 * @returns 화면에서 쓰는 이벤트, 또는 건너뛸 블록이면 null
 */
export function parseEventBlock(block: string): ChatStreamEvent | null {
  let event = ''
  let data = ''

  for (const line of block.split('\n')) {
    // 콜론으로 시작하는 줄은 서버가 연결을 유지하려고 보내는 주석이다
    if (line.startsWith(':')) continue

    // 값 안에도 콜론이 있을 수 있어("시간: 3시") 첫 번째 콜론에서만 나눈다
    const colon = line.indexOf(':')
    if (colon === -1) continue

    const field = line.slice(0, colon)
    const raw = line.slice(colon + 1)
    // 콜론 뒤 공백 한 칸은 구분용이라 뗀다. 있어도 되고 없어도 된다
    const value = raw.startsWith(' ') ? raw.slice(1) : raw

    if (field === 'event') event = value
    if (field === 'data') data = value
  }

  if (!CHAT_EVENTS.includes(event)) return null

  /* 서버가 보낸 JSON 모양을 실행 중에 검사하지는 않는다. 같은 팀 서버라 계약(타입)을 믿고,
     이벤트 이름만 확인해 그 타입으로 넘긴다 */
  return { event, data: parseData(event, data) } as ChatStreamEvent
}

/**
 * data 값을 JSON으로 읽는다
 * 백엔드가 직접 만드는 error 이벤트만 평문 문장이라, 그때는 message로 감싼다
 * 그 밖의 JSON 오류는 서버 계약이 깨진 것이라 숨기지 않고 던진다
 */
function parseData(event: string, data: string): unknown {
  try {
    return JSON.parse(data)
  } catch (error) {
    if (event === 'error') return { message: data }
    throw error
  }
}
