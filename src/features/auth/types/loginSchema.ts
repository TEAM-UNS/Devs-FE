import { z } from 'zod'

/**
 * 로그인 스키마 — 검증+타입 단일 소스.
 * react-hook-form + zodResolver로 쓰므로 `errors.<field>.message`가 실제로 렌더된다
 * → 회원가입 3·4단계와 달리 문구를 둔다(신규 가입 규칙이 아니라 입력 형식만 본다).
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, '이메일을 입력해주세요')
    .email('올바른 이메일 형식이 아니에요'),
  password: z.string().min(1, '비밀번호를 입력해주세요'),
})

export type LoginInput = z.infer<typeof loginSchema>
