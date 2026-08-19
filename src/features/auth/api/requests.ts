import { post } from '@/shared/api'
import type {
  LoginRequest,
  LoginResponse,
  MessageResponse,
  SendEmailCodeRequest,
  SignupRequest,
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
