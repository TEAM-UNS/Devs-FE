/*
 * auth API의 요청·응답 모양. Notion API 명세(`/auth` 카테고리)를 그대로 옮긴 것이며,
 * 폼 입력 타입(`signupSchema.ts`·`loginSchema.ts`)과는 별개다.
 *
 * POST /reissue 는 여기 없다. refreshToken을 `X-Refresh-Token` 헤더로 보내고
 * accessToken만 돌려받는(회전 없음) 엔드포인트인데, 401 재시도가 HTTP 층의
 * 책임이라 `shared/api/http`가 직접 호출한다.
 */

/** 경력 구간 — 명세의 `personalHistory` ENUM. */
export type PersonalHistory =
  'NO_EXPERIENCE' | 'ENTRY_LEVEL' | 'JUNIOR' | 'MIDDLE' | 'SENIOR'

/** 안내 문구를 돌려주는 응답. */
export interface MessageResponse {
  message: string
}

/**
 * POST /user/signup 요청 본문.
 *
 * 필드명은 명세를 그대로 따른다(카멜케이스). 임의로 바꾸면 서버가 못 읽는다.
 */
export interface SignupRequest {
  email: string
  name: string
  password: string
  personalHistory: PersonalHistory
  majorIds: number[]
  skillIds: number[]
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
 * 보관 형태(`AuthTokens`)와 이름이 같지만 타입이 달라 `useLogin`이 옮겨 담는다.
 */
export interface LoginResponse {
  accessToken: string
  refreshToken: string
}

/**
 * 소셜 로그인 provider. 값이 경로(`/user/oauth/{provider}/token`)와 인가 시작 주소
 * (`/oauth2/authorization/{provider}`)에 그대로 들어가므로 서버 표기를 따른다.
 */
export type OAuthProvider = 'google' | 'github'

/**
 * POST /user/oauth/{provider}/token 응답 (200).
 *
 * 이메일 로그인과 달리 본문 없이 부르고, 인증 근거는 서버가 콜백에서 심어준 세션 쿠키다.
 * 그래서 이 요청만 `withCredentials`가 필요하다.
 */
export interface OAuthTokenResponse {
  accessToken: string
  refreshToken: string
  /** 전공 또는 기술 스택이 비어 있어 온보딩이 필요한지. */
  onboardingRequired: boolean
}

/** PUT /user/major 요청 본문 — 온보딩에서 전공·경력을 채운다. */
export interface UpdateMajorRequest {
  personalHistory: PersonalHistory
  majorIds: number[]
}

/** PUT /user/tech-stack 요청 본문 — 온보딩에서 기술 스택을 채운다. */
export interface UpdateTechStackRequest {
  skillIds: number[]
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
