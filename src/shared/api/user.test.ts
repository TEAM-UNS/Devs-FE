import { beforeEach, describe, expect, it, vi } from 'vitest'
import { get } from './http'
import { fetchMyProfile, userQueries } from './user'

vi.mock('./http', () => ({
  get: vi.fn(() => Promise.resolve({})),
}))

beforeEach(() => {
  vi.mocked(get).mockClear()
})

describe('사용자 정보 요청', () => {
  it('내 프로필은 파라미터 없이 /user/my로 부른다', async () => {
    await fetchMyProfile()

    expect(get).toHaveBeenCalledWith('/user/my')
  })

  it('쿼리는 user 키 아래에 둔다', () => {
    expect(userQueries.me().queryKey).toEqual(['user', 'me'])
  })
})
