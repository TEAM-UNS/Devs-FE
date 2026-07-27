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

const PASSWORD_MIN = 8
const PASSWORD_MAX = 20

/** 같은 문자가 4자 이상 연속되는지 (예: aaaa, 1111). */
function hasRepeatedRun(value: string): boolean {
  return /(.)\1{3}/.test(value)
}

/** 문자 코드가 4자 이상 연속 증가/감소하는지 (예: abcd, 1234, dcba). */
function hasSequentialRun(value: string): boolean {
  for (let i = 0; i + 3 < value.length; i++) {
    let ascending = true
    let descending = true
    for (let k = 1; k < 4; k++) {
      const diff = value.charCodeAt(i + k) - value.charCodeAt(i + k - 1)
      if (diff !== 1) ascending = false
      if (diff !== -1) descending = false
    }
    if (ascending || descending) return true
  }
  return false
}

const PASSWORD_MESSAGE = `8~20자의 영문, 숫자를 조합해 주세요. (연속/동일 문자 4자 금지)`

/** 회원가입 2단계(이름·비밀번호) 스키마 — 검증+타입 단일 소스. */
export const signupStep2Schema = z
  .object({
    name: z.string().min(1, '이름을 입력해주세요'),
    password: z
      .string()
      .min(PASSWORD_MIN, PASSWORD_MESSAGE)
      .max(PASSWORD_MAX, PASSWORD_MESSAGE)
      .regex(/[a-zA-Z]/, PASSWORD_MESSAGE)
      .regex(/[0-9]/, PASSWORD_MESSAGE)
      .refine((v) => !hasRepeatedRun(v), PASSWORD_MESSAGE)
      .refine((v) => !hasSequentialRun(v), PASSWORD_MESSAGE),
    passwordConfirm: z.string().min(1, PASSWORD_MESSAGE),
  })
  .refine((d) => d.password === d.passwordConfirm, {
    message: '비밀번호가 일치하지 않아요',
    path: ['passwordConfirm'],
  })

export type SignupStep2Input = z.infer<typeof signupStep2Schema>

/** 전공 최대 선택 개수. */
export const MAX_MAJORS = 5

/**
 * 회원가입 3단계(전공·경력) 스키마 — 검증+타입 단일 소스.
 * 전공 1~MAX_MAJORS개 + 경력 유무, 경력 '있음'이면 연차(careerLevel) 필수.
 */
export const signupStep3Schema = z
  .object({
    majors: z.array(z.string()).min(1, '전공을 선택해주세요').max(MAX_MAJORS),
    careerType: z.enum(['none', 'has']),
    careerLevel: z.string().optional(),
  })
  .refine((d) => d.careerType !== 'has' || Boolean(d.careerLevel), {
    message: '경력을 선택해주세요',
    path: ['careerLevel'],
  })

export type SignupStep3Input = z.infer<typeof signupStep3Schema>
