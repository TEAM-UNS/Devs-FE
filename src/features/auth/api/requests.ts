import { post, put } from '@/shared/api'
import type {
  LoginRequest,
  LoginResponse,
  MessageResponse,
  OAuthProvider,
  OAuthTokenResponse,
  SendEmailCodeRequest,
  SignupRequest,
  UpdateMajorRequest,
  UpdateTechStackRequest,
  VerifyEmailRequest,
} from '../types'

/** 회원가입한다. (POST /signup) */
export async function signup(body: SignupRequest): Promise<MessageResponse> {
  return post<MessageResponse>('/user/signup', body)
}

/**
 * 로그인한다. (POST /login)
 * 두 토큰 모두 응답 본문으로 오므로 저장 책임은 이 함수를 부르는 쪽에 있다.
 */
export async function login(body: LoginRequest): Promise<LoginResponse> {
  return post<LoginResponse>('/user/login', body)
}

/** 이메일로 인증코드를 발송한다. (POST /email/send) */
export async function sendEmailCode(
  body: SendEmailCodeRequest,
): Promise<MessageResponse> {
  return post<MessageResponse>('/user/email/send', body)
}

/** 이메일 인증코드를 검증한다. (POST /user/email/verify) */
export async function verifyEmail(
  body: VerifyEmailRequest,
): Promise<MessageResponse> {
  return post<MessageResponse>('/user/email/verify', body)
}

/**
 * OAuth 세션을 서비스 토큰으로 바꾼다. (POST /user/oauth/{provider}/token)
 *
 * provider가 인가를 마치면 서버가 세션 쿠키(JSESSIONID)를 심고 프론트로 돌려보낸다.
 * 그 쿠키가 이 요청의 유일한 인증 근거라 `withCredentials`로 실어 보낸다 —
 * 쿠키는 API 도메인 것이라 JS가 읽을 수 없고, 대신 보낼 수만 있다.
 *
 * 본문이 없는 것은 명세대로다. 서버가 세션에서 사용자를 찾는다.
 */
export async function exchangeOAuthToken(
  provider: OAuthProvider,
): Promise<OAuthTokenResponse> {
  return post<OAuthTokenResponse>(`/user/oauth/${provider}/token`, undefined, {
    withCredentials: true,
  })
}

/**
 * 전공과 경력을 저장한다. (PUT /user/major)
 *
 * 회원가입은 `POST /user/signup` 한 번에 다 보내지만 온보딩은 전공과 기술 스택이
 * 엔드포인트부터 나뉘어 있어, 둘을 각각 부른다.
 */
export async function updateMajor(
  body: UpdateMajorRequest,
): Promise<MessageResponse> {
  return put<MessageResponse>('/user/major', body)
}

/** 기술 스택을 저장한다. (PUT /user/tech-stack) */
export async function updateTechStack(
  body: UpdateTechStackRequest,
): Promise<MessageResponse> {
  return put<MessageResponse>('/user/tech-stack', body)
}
