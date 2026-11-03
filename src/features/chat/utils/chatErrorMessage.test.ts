import { describe, expect, it } from 'vitest'
import {
  CHAT_ERROR,
  streamErrorMessage,
  thrownErrorMessage,
} from './chatErrorMessage'

const streamError = (status?: number) =>
  Object.assign(new Error('stream'), { name: 'ChatStreamError', status })

describe('thrownErrorMessage — 스트림 시작 전 실패와 끊김', () => {
  it.each([
    [401, CHAT_ERROR.unauthorized],
    [404, CHAT_ERROR.notFound],
    [429, CHAT_ERROR.rateLimited],
    [500, CHAT_ERROR.default],
  ])('상태 코드 %i에 맞는 문구를 고른다', (status, expected) => {
    expect(thrownErrorMessage(streamError(status))).toBe(expected)
  })

  it('상태 코드 없이 끊긴 스트림은 중간에 끊겼다고 알린다', () => {
    expect(thrownErrorMessage(streamError())).toBe(CHAT_ERROR.interrupted)
  })

  it('서버에 닿지 못한 fetch 실패(TypeError)는 네트워크 문구를 보여준다', () => {
    expect(thrownErrorMessage(new TypeError('Failed to fetch'))).toBe(
      CHAT_ERROR.network,
    )
  })
})

describe('streamErrorMessage — 스트림 도중 error 이벤트', () => {
  it('서버가 보낸 message를 그대로 보여준다 (일일 한도 초과)', () => {
    const message = '오늘 사용량을 모두 썼습니다. 내일 다시 이용해주세요.'
    const data = {
      code: 'RATE_LIMITED',
      message,
      detail: { reset: 1762182000 },
    }

    expect(streamErrorMessage(data)).toBe(message)
  })

  it.each([
    ['빈 문자열', { message: '' }],
    ['공백뿐', { message: '  ' }],
    ['없음', {}],
  ])('message가 %s이면 기본 문구를 보여준다', (_, data) => {
    expect(streamErrorMessage(data)).toBe(CHAT_ERROR.default)
  })
})
