export {
  CODE_LENGTH,
  signupStep1Schema,
  emailOnlySchema,
  signupStep2Schema,
  signupStep3Schema,
  MAX_MAJORS,
  signupStep4Schema,
  type SignupStep1Input,
  type SignupStep2Input,
  type SignupStep3Input,
  type SignupStep4Input,
} from './signupSchema'
export { loginSchema, type LoginInput } from './loginSchema'
// authApi는 타입만 담고 전부 공개 대상이라 통째로 내보낸다.
// (이름을 손으로 나열하면 타입을 추가할 때마다 여기를 같이 고쳐야 한다)
export type * from './authApi'
