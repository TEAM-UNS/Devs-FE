const ACCESS_TOKEN_KEY = 'uns-access-token'
const REFRESH_TOKEN_KEY = 'uns-refresh-token'

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

/** 요청 헤더에 실을 accessToken */
export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

/** 재발급에 쓸 refreshToken */
export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY)
}

/**
 * 로그인, 재발급으로 받은 토큰 보관
 *
 * 값이 문자열이 아니면 저장하지 않고 던진다 `localStorage.setItem`은 무엇이든
 * 문자열로 바꿔 담아서, 응답 필드명이 어긋나면 `"undefined"`가 저장되는데 그 값은
 * truthy라 라우트 가드를 통과하고 헤더에도 실려, 로그인은 된 것처럼 보이는데 모든
 * 요청이 401로 돌아오는 상태가 되기 때문에 여기서 undefined인지 검사
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

/** 토큰 전체 초기화 */
export function clearTokens(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
}
