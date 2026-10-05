import { beforeEach, describe, expect, it, vi } from 'vitest'
import { get } from '@/shared/api/http'
import { mypageQueries } from './mypageQueries'
import { fetchMyProfile } from './requests'

vi.mock('@/shared/api/http', () => ({
  get: vi.fn(() => Promise.resolve({})),
}))

beforeEach(() => {
  vi.mocked(get).mockClear()
})

describe('마이페이지 요청', () => {
  it('내 프로필은 파라미터 없이 /user/my로 부른다', async () => {
    await fetchMyProfile()

    expect(get).toHaveBeenCalledWith('/user/my')
  })
})

describe('mypageQueries', () => {
  it('프로필 쿼리는 mypage 키 아래에 둔다', () => {
    expect(mypageQueries.profile().queryKey).toEqual(['mypage', 'profile'])
  })
})
