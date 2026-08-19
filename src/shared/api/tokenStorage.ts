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

/**
 * 로그인·재발급으로 받은 토큰을 보관한다.
 *
 * 값이 문자열이 아니면 저장하지 않고 던진다. `localStorage.setItem`은 무엇이든
 * 문자열로 바꿔 담아서, 응답 필드명이 어긋나면 `"undefined"`가 저장된다. 그 값은
 * truthy라 라우트 가드를 통과하고 헤더에도 실려, 로그인은 된 것처럼 보이는데 모든
 * 요청이 401로 돌아오는 상태가 된다. 조용히 넘기지 않고 여기서 끊는다.
 */
export function setTokens(tokens: AuthTokens): void {
  const { accessToken, refreshToken } = tokens

  if (typeof accessToken !== 'string' || typeof refreshToken !== 'string') {
    throw new Error(
      `로그인 응답에서 토큰을 찾지 못했습니다. 받은 키: ${Object.keys(tokens).join(', ')}`,
    )
  }

  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
}

/** 세션을 버린다. 재발급이 거절당했을 때 쓴다. */
export function clearTokens(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
}
