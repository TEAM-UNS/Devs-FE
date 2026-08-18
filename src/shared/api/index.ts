// api 세그먼트 배럴. 외부는 `@/shared/api`로만 접근한다.
//
// 노출은 최소로 둔다. `HttpError`는 errorMessage가 대신 읽어 주므로 밖에서 필요 없고,
// `clearTokens`·`getRefreshToken`은 재발급 흐름 전용이라 http.ts가 직접 쓴다
// — 열어두면 세션을 지우는 곳이 늘어난다.
export { get, post } from './http'
export { errorMessage } from './errorMessage'
export { getAccessToken, setTokens } from './tokenStorage'
