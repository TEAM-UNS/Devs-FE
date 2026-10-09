import { describe, expect, it } from 'vitest'
import type { ChatStreamEvent } from '../types/chatApi'
import { parseEventBlock, splitEventBlocks } from './sseParser'

/* 테스트는 쉬운 것부터 순서대로 놓았다. 위에서부터 하나씩 통과시키면 된다 */

describe('splitEventBlocks — 버퍼를 이벤트 블록으로 자르기', () => {
  it('빈 줄로 끝나는 이벤트 하나를 블록 하나로 잘라 낸다', () => {
    expect(splitEventBlocks('event:token\ndata:{"text":"안녕"}\n\n')).toEqual({
      blocks: ['event:token\ndata:{"text":"안녕"}'],
      rest: '',
    })
  })

  it('한 조각에 이벤트가 두 개 오면 블록 두 개로 나눈다', () => {
    expect(
      splitEventBlocks(
        'event:token\ndata:{"text":"A"}\n\nevent:token\ndata:{"text":"B"}\n\n',
      ),
    ).toEqual({
      blocks: [
        'event:token\ndata:{"text":"A"}',
        'event:token\ndata:{"text":"B"}',
      ],
      rest: '',
    })
  })

  it('빈 줄이 아직 안 왔으면 블록 없이 전부 rest로 남긴다', () => {
    expect(splitEventBlocks('event:token\ndata:{"te')).toEqual({
      blocks: [],
      rest: 'event:token\ndata:{"te',
    })
  })

  it('완성된 이벤트 뒤에 반쪽이 붙어 오면 반쪽만 rest로 남긴다', () => {
    expect(
      splitEventBlocks('event:token\ndata:{"text":"A"}\n\nevent:tok'),
    ).toEqual({
      blocks: ['event:token\ndata:{"text":"A"}'],
      rest: 'event:tok',
    })
  })

  it('줄바꿈이 \\r\\n이어도 똑같이 자르고, 블록 안 줄바꿈은 \\n으로 맞춘다', () => {
    expect(
      splitEventBlocks('event:token\r\ndata:{"text":"A"}\r\n\r\nevent:to'),
    ).toEqual({
      blocks: ['event:token\ndata:{"text":"A"}'],
      rest: 'event:to',
    })
  })
})

describe('parseEventBlock — 블록 하나를 이벤트 객체로', () => {
  it('token 이벤트의 data를 JSON으로 읽는다', () => {
    expect(parseEventBlock('event:token\ndata:{"text":"React를 "}')).toEqual({
      event: 'token',
      data: { text: 'React를 ' },
    })
  })

  it('콜론 뒤 공백이 있어도 똑같이 읽는다', () => {
    expect(parseEventBlock('event: token\ndata: {"text":"React를 "}')).toEqual({
      event: 'token',
      data: { text: 'React를 ' },
    })
  })

  it.each<ChatStreamEvent>([
    { event: 'session', data: { session_id: 42, is_new: true } },
    { event: 'title', data: { title: 'React 관련 요구 기술' } },
    { event: 'done', data: { message_id: 1042 } },
  ])('$event 이벤트를 읽는다', (expected) => {
    const block = `event:${expected.event}\ndata:${JSON.stringify(expected.data)}`

    expect(parseEventBlock(block)).toEqual(expected)
  })

  it('값 안에 콜론이 있어도 첫 번째 콜론에서만 나눈다', () => {
    expect(parseEventBlock('event:token\ndata:{"text":"시간: 3시"}')).toEqual({
      event: 'token',
      data: { text: '시간: 3시' },
    })
  })

  it('콜론으로 시작하는 주석 줄은 건너뛴다', () => {
    expect(
      parseEventBlock(': keep-alive\nevent:token\ndata:{"text":"A"}'),
    ).toEqual({ event: 'token', data: { text: 'A' } })
  })

  it('주석만 있는 블록은 이벤트가 아니다', () => {
    expect(parseEventBlock(': keep-alive')).toBeNull()
  })

  it.each([
    'event:graph\ndata:{"id":"g_01","type":"bar","data":[]}',
    'event:tool_start\ndata:{"tool":"get_related_skills","label":"분석하고 있어요"}',
  ])('채팅에서 쓰지 않는 이벤트는 건너뛴다 (%s)', (block) => {
    expect(parseEventBlock(block)).toBeNull()
  })

  it('AI 서버의 error 이벤트는 JSON 그대로 읽는다', () => {
    expect(
      parseEventBlock(
        'event:error\ndata:{"code":"LLM_UNAVAILABLE","message":"답변 생성에 실패했습니다.","recoverable":true}',
      ),
    ).toEqual({
      event: 'error',
      data: {
        code: 'LLM_UNAVAILABLE',
        message: '답변 생성에 실패했습니다.',
        recoverable: true,
      },
    })
  })

  it('백엔드가 보내는 평문 error는 message로 감싼다', () => {
    expect(
      parseEventBlock('event:error\ndata:AI 응답을 가져오지 못했습니다.'),
    ).toEqual({
      event: 'error',
      data: { message: 'AI 응답을 가져오지 못했습니다.' },
    })
  })
})

describe('두 함수를 이어서 — 실제 스트림처럼 조각을 차례로 넣기', () => {
  /* 3단계 전송 함수가 할 일을 흉내 낸다. 조각마다 버퍼에 붙이고, 완성된 블록만 이벤트로 바꾼다 */
  function feed(chunks: string[]): ChatStreamEvent[] {
    const events: ChatStreamEvent[] = []
    let buffer = ''

    for (const chunk of chunks) {
      const { blocks, rest } = splitEventBlocks(buffer + chunk)
      buffer = rest

      for (const block of blocks) {
        const event = parseEventBlock(block)
        if (event) events.push(event)
      }
    }

    return events
  }

  it('이벤트가 조각 경계에 걸려 와도 순서대로 하나씩 나온다', () => {
    const chunks = [
      'event:session\ndata:{"session_id":42,"is_new":true}\n\nevent:tok',
      'en\ndata:{"text":"React를 요"}\n\nevent:token\ndata:{"text":"구하는',
      '"}\n\n',
    ]

    expect(feed(chunks)).toEqual([
      { event: 'session', data: { session_id: 42, is_new: true } },
      { event: 'token', data: { text: 'React를 요' } },
      { event: 'token', data: { text: '구하는' } },
    ])
  })
})
