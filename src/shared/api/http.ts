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

/* 토큰 없이 부르는 경로, 옛날 토큰을 담으면 401이 나고 401 에러가 반환 되더라도 재시도하지 않음 */
const PUBLIC_PATHS = new Set([
  '/user/login',
  '/user/signup',
  '/user/email/send',
  '/user/email/verify',
  REISSUE_PATH,
])

/* OAuth 토큰 교환(`/user/oauth/google/token` 등)도 공개 경로이지만,
뒤에 google과 같은 추가 경로 때문에 has로 정상적인 판별이 이루어지지 않기 때문에 접두사를 이용하여 판단 */
const OAUTH_TOKEN_PREFIX = '/user/oauth/'

const isPublic = (path: string) =>
  PUBLIC_PATHS.has(path) || path.startsWith(OAUTH_TOKEN_PREFIX)

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '',
  timeout: 10_000,
})

client.interceptors.request.use((config) => {
  const accessToken = isPublic(config.url ?? '') ? null : getAccessToken()
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`
  return config
})

/* 동시에 여러 401 에러가 나더라도 1번만 리슈 요청을 하도록 한다 */
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

    setTokens({ accessToken: data.access_token, refreshToken })
    return true
  } catch (error) {
    // 네트워크 오류는 undefined로 뜨기 때문에 네트워크 오류는 넘기고 401이나 403만 토큰 초기화
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
 * accessToken 만료로 401이면 리슈받아 한 번만 다시 보냄
 * 첫 요청에서 성공하면 그대로 종료되고,
 * 첫 요청에서 실패하면 에러 코드를 보고 401이 아니거나 공개 경로라면 리슈로 해결되는 것이 아니니
 * 에러를 던지고 401이고 공개 경로도 아니라면 리슈 요청 후 본요청을 다시 보냄
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
 * GET 요청
 * `params`는 axios가 쿼리스트링으로 붙인다. 값이 `undefined`인 항목은 빼므로
 * '필터 없음'을 부르는 쪽에서 직접 거를 필요 없이 바로 사용하면 됨
 */
export async function get<TResponse>(
  path: string,
  params?: Record<string, string | number | undefined>,
): Promise<TResponse> {
  return withRetry(path, () => client.get<TResponse>(path, { params }))
}

/**
 * `withCredentials`: 이 요청에만 쿠키를 실어 보낸다. 인스턴스 전체에 켜지 않는 이유는,
 * 우리 인증이 Authorization 헤더라 나머지 요청에는 쿠키가 필요 없음
 */
export interface RequestConfig {
  withCredentials?: boolean
}

/** JSON 본문을 실어 POST 요청 */
export async function post<TResponse>(
  path: string,
  body?: unknown,
  config?: RequestConfig,
): Promise<TResponse> {
  return withRetry(path, () => client.post<TResponse>(path, body, config))
}

/** JSON 본문을 실어 PUT 요청 */
export async function put<TResponse>(
  path: string,
  body?: unknown,
  config?: RequestConfig,
): Promise<TResponse> {
  return withRetry(path, () => client.put<TResponse>(path, body, config))
}
