/*
 * auth API의 요청·응답 모양. Notion API 명세(`/auth` 카테고리)를 그대로 옮긴 것이며,
 * 폼 입력 타입(`signupSchema.ts`·`loginSchema.ts`)과는 별개다.
 *
 * POST /reissue 는 여기 없다. refreshToken을 `X-Refresh-Token` 헤더로 보내고
 * accessToken만 돌려받는(회전 없음) 엔드포인트인데, 401 재시도가 HTTP 층의
 * 책임이라 `shared/api/http`가 직접 호출한다.
 */

/** 경력 구간 — 명세의 `personal_history` ENUM. */
export type PersonalHistory =
  'NO_EXPERIENCE' | 'ENTRY_LEVEL' | 'JUNIOR' | 'MIDDLE' | 'SENIOR'

/** 안내 문구를 돌려주는 응답. */
export interface MessageResponse {
  message: string
}

/**
 * POST /user/signup 요청 본문.
 *
 * 필드명은 명세를 그대로 따른다(스네이크케이스). 임의로 통일하면 서버가 못 읽는다.
 */
export interface SignupRequest {
  email: string
  name: string
  password: string
  personal_history: PersonalHistory
  major_ids: number[]
  skill_ids: number[]
}

/** POST /login 요청 본문. */
export interface LoginRequest {
  email: string
  password: string
}

/**
 * POST /user/login 응답 (200). 두 토큰 모두 본문으로 내려온다(쿠키 방식 아님).
 * 즉 저장·전송 책임이 전부 프론트에 있다.
 *
 * 서버는 모든 필드를 스네이크케이스로 준다. 보관 형태(`AuthTokens`)와 이름이 다르므로
 * `useLogin`이 옮겨 담는다.
 */
export interface LoginResponse {
  access_token: string
  refresh_token: string
}

/** POST /email/send 요청 본문. */
export interface SendEmailCodeRequest {
  email: string
}

/** POST /email/verify 요청 본문. */
export interface VerifyEmailRequest {
  email: string
  code: string
}
