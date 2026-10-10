import { isChatStreamError } from '../api'

/* 디자인에 없는 문구라 확정 전 임시. 기존 챗봇 문구와 같은 말투로 맞췄다 */
export const CHAT_ERROR = {
  default: '답변을 불러오지 못했습니다. 다시 시도해 주세요.',
  unauthorized: '로그인이 만료됐습니다. 다시 로그인해 주세요.',
  notFound: '대화를 찾을 수 없습니다. 새 대화에서 다시 질문해 주세요.',
  rateLimited: '질문이 너무 많습니다. 잠시 후 다시 시도해 주세요.',
  network: '네트워크 연결을 확인한 뒤 다시 시도해 주세요.',
  interrupted: '답변이 중간에 끊겼습니다. 다시 시도해 주세요.',
  llmUnavailable: '답변 생성에 실패했습니다. 잠시 후 다시 시도해 주세요.',
} as const

const STATUS_MESSAGES: Readonly<Record<number, string>> = {
  401: CHAT_ERROR.unauthorized,
  404: CHAT_ERROR.notFound,
  429: CHAT_ERROR.rateLimited,
}

/**
 * 스트림 도중 온 error 이벤트의 문구
 * AI 서버는 code를 보내고, 백엔드가 직접 만든 에러는 code 없이 평문만 온다
 */
export function streamErrorMessage(code?: string): string {
  return code === 'LLM_UNAVAILABLE'
    ? CHAT_ERROR.llmUnavailable
    : CHAT_ERROR.default
}

/**
 * streamChat이 던진 에러의 문구
 * 스트림 시작 전 실패는 상태 코드로, 상태 코드가 없으면 중간에 끊긴 것이다
 */
export function thrownErrorMessage(error: unknown): string {
  if (isChatStreamError(error)) {
    if (error.status === undefined) return CHAT_ERROR.interrupted
    return STATUS_MESSAGES[error.status] ?? CHAT_ERROR.default
  }
  // fetch는 서버에 닿지 못하면(오프라인·CORS 등) TypeError를 던진다
  if (error instanceof TypeError) return CHAT_ERROR.network

  return CHAT_ERROR.default
}
