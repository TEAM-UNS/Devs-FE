import axios from 'axios'
import type { AxiosResponse } from 'axios'
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setTokens,
} from './tokenStorage'

const REISSUE_PATH = '/user/reissue'
const REFRESH_TOKEN_HEADER = 'X-Refresh-Token'

/* 토큰 없이 부르는 경로. 옛 토큰을 실으면 오히려 401이 나고, 401이 나도 재발급으로
   결과가 바뀌지 않으므로 재시도 대상에서도 뺀다. */
const PUBLIC_PATHS = new Set([
  '/user/login',
  '/user/signup',
  '/user/email/send',
  '/user/email/verify',
  REISSUE_PATH,
])

/* OAuth 토큰 교환(`/user/oauth/google/token` 등)도 같은 이유로 공개 경로다. 이 요청이
   인증하는 근거는 accessToken이 아니라 서버가 심어준 세션 쿠키이고, 여기서 401이 나는 건
   그 세션이 없다는 뜻이라 재발급으로 뒤집히지 않는다. provider가 경로에 들어가 목록으로
   나열할 수 없어 접두사로 판별한다. */
const OAUTH_TOKEN_PREFIX = '/user/oauth/'

const isPublic = (path: string) =>
  PUBLIC_PATHS.has(path) || path.startsWith(OAUTH_TOKEN_PREFIX)

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '',
  // 서버가 죽어 있으면 응답 없이 매달려 있고 그동안 버튼이 잠긴 채로 남는다.
  timeout: 10_000,
})

client.interceptors.request.use((config) => {
  const accessToken = isPublic(config.url ?? '') ? null : getAccessToken()
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`
  return config
})

/* 동시에 401이 여러 개 떠도 재발급은 한 번만 돈다. */
let refreshInFlight: Promise<boolean> | null = null

async function refreshAccessToken(): Promise<boolean> {
  const refreshToken = getRefreshToken()
  if (!refreshToken) return false

  try {
    const { data } = await client.post<{ access_token?: string }>(
      REISSUE_PATH,
      undefined,
      { headers: { [REFRESH_TOKEN_HEADER]: refreshToken } },
    )
    if (!data.access_token) return false

    // 응답이 accessToken만 주므로 refreshToken은 회전 없이 재사용한다.
    setTokens({ accessToken: data.access_token, refreshToken })
    return true
  } catch (error) {
    // refreshToken이 거절당했을 때만 세션을 버린다. 5xx·네트워크 오류는 잠깐일 수 있어
    // 토큰을 남기고 실패만 알린다.
    const status = axios.isAxiosError(error)
      ? error.response?.status
      : undefined
    if (status === 401 || status === 403) clearTokens()
    return false
  }
}

function refreshOnce(): Promise<boolean> {
  refreshInFlight ??= refreshAccessToken().finally(() => {
    refreshInFlight = null
  })

  return refreshInFlight
}

/**
 * accessToken 만료로 401이면 재발급받아 한 번만 다시 보낸다.
 *
 * 재시도를 응답 인터셉터가 아니라 여기서 하는 이유: 인터셉터에서 `client(config)`를
 * 부르면 같은 체인으로 재진입해서, 무한 루프를 막으려면 config에 재시도 표시를
 * 남겨야 한다. 그 표시는 config 객체가 그대로 전달된다는 전제에 기대고 타입 검사도
 * 못 잡는다. 여기서는 `send()`를 두 번 부르고 끝이라 재귀가 없다.
 */
async function withRetry<TResponse>(
  path: string,
  send: () => Promise<AxiosResponse<TResponse>>,
): Promise<TResponse> {
  try {
    return (await send()).data
  } catch (error) {
    const status = axios.isAxiosError(error)
      ? error.response?.status
      : undefined
    if (status !== 401 || isPublic(path)) throw error
    if (!(await refreshOnce())) throw error

    // 요청 인터셉터가 다시 돌아 새 accessToken이 실린다.
    return (await send()).data
  }
}

/**
 * GET 요청.
 *
 * `params`는 axios가 쿼리스트링으로 붙인다. 값이 `undefined`인 항목은 빼므로
 * '필터 없음'을 부르는 쪽에서 분기하지 않고 그대로 넘기면 된다.
 */
export async function get<TResponse>(
  path: string,
  params?: Record<string, string | number | undefined>,
): Promise<TResponse> {
  return withRetry(path, () => client.get<TResponse>(path, { params }))
}

/**
 * 요청 단위로 열어두는 설정.
 *
 * `withCredentials`: 이 요청에만 쿠키를 실어 보낸다. 인스턴스 전체에 켜지 않는 이유는,
 * 우리 인증이 Authorization 헤더라 나머지 요청에는 쿠키가 필요 없고 CSRF 표면만 넓어지기
 * 때문이다. 지금 필요한 곳은 OAuth 토큰 교환 하나뿐이다.
 */
export interface RequestConfig {
  withCredentials?: boolean
}

/** JSON 본문을 실어 POST 한다. */
export async function post<TResponse>(
  path: string,
  body?: unknown,
  config?: RequestConfig,
): Promise<TResponse> {
  return withRetry(path, () => client.post<TResponse>(path, body, config))
}

/** JSON 본문을 실어 PUT 한다. */
export async function put<TResponse>(
  path: string,
  body?: unknown,
  config?: RequestConfig,
): Promise<TResponse> {
  return withRetry(path, () => client.put<TResponse>(path, body, config))
}
