import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  oauthAuthorizeUrl,
  startOAuthLogin,
  takeOAuthProvider,
} from './oauthProvider'

/* jsdom의 location.assign은 재정의가 막혀 있어 spy를 걸 수 없다. location을 통째로
   갈아 끼우고 테스트가 끝나면 원래 것을 돌려놓는다. */
const realLocation = window.location

/* 주소는 .env의 베이스에 붙어서 나온다. 배포 주소를 여기 적으면 환경이 바뀔 때마다
   테스트가 깨지므로, 검사할 것만 검사한다 — 베이스가 앞에 붙는지와 경로 모양이 맞는지. */
const BASE = import.meta.env.VITE_API_BASE_URL ?? ''

function stubAssign() {
  const assign = vi.fn()
  Object.defineProperty(window, 'location', {
    configurable: true,
    writable: true,
    value: { ...realLocation, assign },
  })

  return assign
}

describe('oauthProvider', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  afterEach(() => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      writable: true,
      value: realLocation,
    })
  })

  it('provider별 인가 시작 주소를 만든다', () => {
    expect(oauthAuthorizeUrl('google')).toBe(
      `${BASE}/oauth2/authorization/google`,
    )
    expect(oauthAuthorizeUrl('github')).toBe(
      `${BASE}/oauth2/authorization/github`,
    )
  })

  it('로그인을 시작하면 provider를 적어두고 인가 주소로 이동한다', () => {
    const assign = stubAssign()

    startOAuthLogin('github')

    expect(assign).toHaveBeenCalledWith(`${BASE}/oauth2/authorization/github`)
    // 이동 전에 적혀 있어야 콜백에서 꺼낼 수 있다.
    expect(sessionStorage.getItem('uns-oauth-provider')).toBe('github')
  })

  it('꺼낸 provider는 지워져서 두 번 쓰이지 않는다', () => {
    stubAssign()
    startOAuthLogin('google')

    expect(takeOAuthProvider()).toBe('google')
    // 새로고침·뒤로가기로 콜백에 다시 와도 이미 끝난 세션으로 교환을 시도하지 않는다.
    expect(takeOAuthProvider()).toBeNull()
  })

  it('표식이 없으면 null이다', () => {
    expect(takeOAuthProvider()).toBeNull()
  })

  it('아는 provider가 아니면 null이다', () => {
    sessionStorage.setItem('uns-oauth-provider', 'kakao')

    expect(takeOAuthProvider()).toBeNull()
  })
})
