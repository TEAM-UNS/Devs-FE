import { afterEach, describe, expect, it } from 'vitest'
import { NotLoggedInError, get } from './http'
import { clearTokens, setTokens } from './tokenStorage'

describe('토큰 없는 요청', () => {
  afterEach(() => clearTokens())

  it('로그인이 필요한 경로는 서버에 보내지 않고 NotLoggedInError로 실패한다', async () => {
    await expect(get('/user/my')).rejects.toBeInstanceOf(NotLoggedInError)
  })

  it('비로그인에 열린 대시보드·전공 조회는 막지 않는다', async () => {
    // 테스트 환경엔 서버 주소가 없어 다른 이유로 실패하지만, 토큰 때문에 막히지는 않는다
    await expect(get('/dashboard/summary')).rejects.not.toBeInstanceOf(
      NotLoggedInError,
    )
    await expect(get('/majors')).rejects.not.toBeInstanceOf(NotLoggedInError)
  })

  it('토큰이 있으면 막지 않는다', async () => {
    setTokens({ accessToken: 'a', refreshToken: 'r' })

    await expect(get('/user/my')).rejects.not.toBeInstanceOf(NotLoggedInError)
  })
})
