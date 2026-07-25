import { z } from 'zod'

/** 인증 코드 자릿수 — 스키마·입력·문구가 공유하는 단일 소스. */
export const CODE_LENGTH = 6

/** 회원가입 1단계(이메일 인증) 스키마 — 검증+타입 단일 소스. */
export const signupStep1Schema = z.object({
  email: z
    .string()
    .min(1, '이메일을 입력해주세요')
    .email('올바른 이메일 형식이 아니에요'),
  code: z
    .string()
    .length(CODE_LENGTH, `인증 코드 ${CODE_LENGTH}자리를 입력해주세요`)
    .regex(/^\d+$/, '숫자만 입력해주세요'),
})

export type SignupStep1Input = z.infer<typeof signupStep1Schema>

/** '이메일 인증' 버튼 활성화용 — 폼 email 규칙 재사용. */
export const emailOnlySchema = signupStep1Schema.shape.email
