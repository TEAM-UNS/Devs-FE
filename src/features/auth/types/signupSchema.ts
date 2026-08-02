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

/** 동일·연속 문자를 몇 자부터 막을지 */
const SEQUENTIAL_LIMIT = 4

/** 같은 문자가 4자 이상 연속되는지 (예: aaaa, 1111). */
function hasRepeatedRun(value: string): boolean {
  return /(.)\1{3}/.test(value)
}

/**
 * 문자 코드가 4자 이상 연속 증가/감소하는지 (예: abcd, 1234, dcba).
 * 앞 글자와의 차이만 보며 연속 길이를 세고, 끊기면 1로 되돌린다.
 */
function hasSequentialRun(value: string): boolean {
  let ascending = 1
  let descending = 1

  for (let i = 1; i < value.length; i++) {
    const diff = value.charCodeAt(i) - value.charCodeAt(i - 1)

    ascending = diff === 1 ? ascending + 1 : 1
    descending = diff === -1 ? descending + 1 : 1

    if (ascending >= SEQUENTIAL_LIMIT || descending >= SEQUENTIAL_LIMIT) {
      return true
    }
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
 *
 * 1·2단계와 달리 에러 문구(`message`)와 소속 필드(`path`)를 두지 않는다. 이 단계는
 * react-hook-form 없이 `safeParse().success`만 읽어 '다음' 버튼 활성 여부로만 쓰므로
 * 문구를 화면에 띄우는 곳이 없다. 읽히지 않는 문구는 실제 UX 문구와 조용히 어긋난다.
 * 인라인 에러를 붙이는 시점에 문구와 path를 함께 넣는다.
 */
export const signupStep3Schema = z
  .object({
    majors: z.array(z.string()).min(1).max(MAX_MAJORS),
    careerType: z.enum(['none', 'has']),
    careerLevel: z.string().optional(),
  })
  .refine((d) => d.careerType !== 'has' || Boolean(d.careerLevel))

export type SignupStep3Input = z.infer<typeof signupStep3Schema>

/**
 * 회원가입 4단계(기술 스택) 스키마 — 검증+타입 단일 소스.
 * `techStacks`는 전공 id → 선택한 기술 스택 id 목록. 디자인의 그룹 헤더가
 * "(N개 선택됨)"을 전공별로 보여주므로 선택 상태도 전공별로 나눠 담는다.
 * 3단계와 같은 이유로 에러 문구·path를 두지 않는다(위 주석 참고).
 */
export const signupStep4Schema = z
  .object({
    techStacks: z.record(z.string(), z.array(z.string())),
  })
  .refine((d) => Object.values(d.techStacks).some((tags) => tags.length > 0))

export type SignupStep4Input = z.infer<typeof signupStep4Schema>
