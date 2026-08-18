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
 * POST /login 응답 (200). 두 토큰 모두 본문으로 내려온다(쿠키 방식 아님).
 * 즉 저장·전송 책임이 전부 프론트에 있다.
 */
export interface LoginResponse {
  accessToken: string
  refreshToken: string
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

/** 기술 스택 한 개. `id`가 회원가입의 `skill_ids` 원소가 된다. */
export interface TechStackDto {
  id: number
  name: string
}

/**
 * 전공 한 개. `id`가 회원가입의 `majorIds` 원소가 된다.
 * `major`는 표시용 라벨이 아니라 `"BACKEND"` 같은 ENUM 문자열이다.
 */
export interface MajorCategoryDto {
  id: number
  major: string
  tech_stacks: TechStackDto[]
}

/** GET /majors 응답 (200). 전공 안에 기술 스택이 중첩돼 온다. */
export interface MajorsResponse {
  categories: MajorCategoryDto[]
}
