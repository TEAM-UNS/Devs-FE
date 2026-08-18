import axios from 'axios'

const FALLBACK = '요청에 실패했어요. 잠시 후 다시 시도해주세요.'
const TIMEOUT = '서버 응답이 없어요. 잠시 후 다시 시도해주세요.'

/* axios가 타임아웃에 쓰는 코드. 기본은 ECONNABORTED이고
   transitional.clarifyTimeoutError를 켜면 ETIMEDOUT이라 둘 다 본다. */
const TIMEOUT_CODES = new Set(['ECONNABORTED', 'ETIMEDOUT'])

/**
 * 실패한 요청에서 화면에 띄울 문구를 뽑는다.
 *
 * 명세의 `Exception` 칸이 비어 있어 에러 본문의 모양을 모른다. 성공 응답이 전부
 * `message` 키를 쓰므로 그것만 보고, 없으면 고정 문구로 떨어진다.
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
