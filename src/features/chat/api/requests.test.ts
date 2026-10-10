import { beforeEach, describe, expect, it, vi } from 'vitest'
import { get } from '@/shared/api/http'
import { fetchChatMessages, fetchChatSessions } from './requests'

vi.mock('@/shared/api/http', () => ({
  get: vi.fn(() => Promise.resolve({})),
}))

beforeEach(() => {
  vi.mocked(get).mockClear()
})

describe('챗봇 조회 요청', () => {
  it('대화 목록은 페이지 파라미터 없이 서버 기본값(최근 20개)으로 부른다', async () => {
    await fetchChatSessions()

    expect(get).toHaveBeenCalledWith('/chat/sessions')
  })

  it('대화 기록은 대화 id를 경로에 넣어 부른다', async () => {
    await fetchChatMessages(42)

    expect(get).toHaveBeenCalledWith('/chat/sessions/42/messages')
  })
})
