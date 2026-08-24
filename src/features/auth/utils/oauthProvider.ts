/*
 * OAuth 왕복(往復) 한 번을 잇는 표식.
 *
 * 서버가 provider 인가를 마치고 우리 앱으로 돌려보낼 때, URL에는 어느 provider로
 * 로그인했는지가 남지 않는다. 세션 쿠키(JSESSIONID)는 API 도메인 것이라 JS가 읽을 수도
 * 없다. 그래서 나가기 직전에 프론트가 스스로 적어두고 돌아와서 꺼낸다.
 *
 * sessionStorage인 이유: 이 값은 리다이렉트 한 번 동안만 의미가 있다. localStorage에 두면
 * 로그인을 중간에 그만둔 표식이 탭을 닫아도 남아, 다음 방문에 엉뚱한 교환을 시도한다.
 */
import type { OAuthProvider } from '../types'

const PROVIDER_KEY = 'uns-oauth-provider'

/* 서버가 인가를 시작하는 주소. 서버 경로라 `/user` prefix가 붙지 않는다(Spring Security 기본). */
const AUTHORIZE_BASE = '/oauth2/authorization'

const isProvider = (value: string): value is OAuthProvider =>
  value === 'google' || value === 'github'

/**
 * provider 인가 페이지로 가는 주소.
 *
 * `http.ts`와 같은 베이스를 쓰지만 axios를 타지 않는다 — 브라우저를 통째로 넘기는
 * 이동이라 XHR이 아니라 절대 주소가 필요하다.
 *
 * @param provider 로그인에 쓸 소셜 provider
 * @returns 인가 시작 주소
 */
export function oauthAuthorizeUrl(provider: OAuthProvider): string {
  const baseUrl = import.meta.env.VITE_API_BASE_URL ?? ''

  return `${baseUrl}${AUTHORIZE_BASE}/${provider}`
}

/**
 * 소셜 로그인을 시작한다. provider를 적어두고 브라우저를 서버로 넘긴다.
 *
 * 적는 것이 먼저다. 이동이 먼저면 표식을 남기지 못한 채 페이지가 떠날 수 있다.
 *
 * @param provider 로그인에 쓸 소셜 provider
 */
export function startOAuthLogin(provider: OAuthProvider): void {
  sessionStorage.setItem(PROVIDER_KEY, provider)
  window.location.assign(oauthAuthorizeUrl(provider))
}

/**
 * 적어둔 provider를 꺼내고 지운다.
 *
 * 읽자마자 지우는 이유: 표식이 남아 있으면 사용자가 콜백 화면을 새로고침하거나 뒤로가기로
 * 돌아왔을 때 이미 끝난 세션으로 교환을 다시 시도해 401이 뜬다. 한 번 쓰고 버린다.
 *
 * @returns 저장된 provider. 없거나 아는 값이 아니면 `null`
 */
export function takeOAuthProvider(): OAuthProvider | null {
  const stored = sessionStorage.getItem(PROVIDER_KEY)
  sessionStorage.removeItem(PROVIDER_KEY)

  return stored && isProvider(stored) ? stored : null
}
