/*
 * 인증 토큰 보관소. localStorage라 새로고침·탭 재열기에도 로그인이 유지된다.
 *
 * ⚠️ refreshToken이 쿠키가 아니라 본문으로 오는 명세라 JS가 들고 있어야 하고,
 * localStorage는 JS가 읽을 수 있어 XSS가 뚫리면 그대로 새어 나간다. 재발급이
 * refreshToken을 회전시키지 않아 만료까지 유효하다는 점도 같이 감안한 선택이다.
 */

const ACCESS_TOKEN_KEY = 'uns-access-token'
const REFRESH_TOKEN_KEY = 'uns-refresh-token'

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

/** 요청 헤더에 실을 accessToken. */
export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

/** 재발급에 쓸 refreshToken. */
export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY)
}

/** 로그인·재발급으로 받은 토큰을 보관한다. */
export function setTokens(tokens: AuthTokens): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken)
  localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken)
}

/** 세션을 버린다. 재발급이 거절당했을 때 쓴다. */
export function clearTokens(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
}
