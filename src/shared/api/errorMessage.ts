import axios from 'axios'

const FALLBACK = '요청에 실패했어요. 잠시 후 다시 시도해주세요.'
const TIMEOUT = '서버 응답이 없어요. 잠시 후 다시 시도해주세요.'

/* axios가 타임아웃에 쓰는 코드. 기본은 ECONNABORTED이고
   transitional.clarifyTimeoutError를 켜면 ETIMEDOUT이라 둘 다 확인 */
const TIMEOUT_CODES = new Set(['ECONNABORTED', 'ETIMEDOUT'])

/**
 * 실패한 요청에서 화면에 띄울 문구를 정함
 * 서버 에러는 두 가지 모양으로 온다. 비즈니스 에러는
 * `{ status, code, message }`라 `message`를 그대로 띄우고, 검증 실패(400)는 Spring 기본인
 * `{ timestamp, status, error, path }`라 사용자에게 보여줄 문구가 없어 위에서 정의한 기본 문구 표시
 *
 * @param error 실패 원인
 * @returns 표시할 문구
 */
export function errorMessage(error: unknown): string {
  if (!axios.isAxiosError(error)) return FALLBACK
  if (error.code && TIMEOUT_CODES.has(error.code)) return TIMEOUT

  const { message } = (error.response?.data ?? {}) as { message?: unknown }
  return typeof message === 'string' ? message : FALLBACK
}
