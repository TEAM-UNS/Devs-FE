import { describe, expect, it } from 'vitest'
import { signupStep2Schema } from './signupSchema'

/** 비밀번호만 검증한다 (이름·확인란은 통과하도록 채운다) */
function passwordOk(password: string): boolean {
  return signupStep2Schema.safeParse({
    name: '홍길동',
    password,
    passwordConfirm: password,
  }).success
}

describe('signupStep2Schema — 비밀번호', () => {
  it('영문+숫자 8~20자를 통과시킨다', () => {
    expect(passwordOk('pw3nk7ar')).toBe(true)
    expect(passwordOk('Zx9mQ2vLp5Rt')).toBe(true)
  })

  it('길이·구성 요건을 지키지 않으면 막는다', () => {
    expect(passwordOk('pw3nk7a')).toBe(false) // 7자
    expect(passwordOk('pw3nk7ar'.repeat(3))).toBe(false) // 24자
    expect(passwordOk('password')).toBe(false) // 숫자 없음
    expect(passwordOk('39284756')).toBe(false) // 영문 없음
  })

  it('같은 문자가 4자 연속이면 막는다', () => {
    expect(passwordOk('pwaaaa73')).toBe(false)
    expect(passwordOk('pw11117a')).toBe(false)
    // 3자까지는 허용
    expect(passwordOk('pwaaa73k')).toBe(true)
  })

  it('문자 코드가 4자 연속 증가하면 막는다', () => {
    expect(passwordOk('pwabcd73')).toBe(false)
    expect(passwordOk('pw1234ar')).toBe(false)
  })

  it('문자 코드가 4자 연속 감소해도 막는다', () => {
    expect(passwordOk('pwdcba73')).toBe(false)
    expect(passwordOk('pw4321ar')).toBe(false)
  })

  it('3자 연속까지는 허용한다', () => {
    expect(passwordOk('pwabc73k')).toBe(true)
    expect(passwordOk('pw123ark')).toBe(true)
  })

  it('연속이 중간에 끊기면 통과한다', () => {
    // ab 다음 d로 끊기고, 다시 이어져도 4자가 안 된다
    expect(passwordOk('pwabdc73')).toBe(true)
    expect(passwordOk('pw1245ar')).toBe(true)
  })

  it('문자열 끝에서 시작되는 연속도 잡는다', () => {
    expect(passwordOk('pw73abcd')).toBe(false)
    expect(passwordOk('ar79wxyz')).toBe(false)
  })

  it('비밀번호 확인이 다르면 막는다', () => {
    const result = signupStep2Schema.safeParse({
      name: '홍길동',
      password: 'pw3nk7ar',
      passwordConfirm: 'pw3nk7as',
    })

    expect(result.success).toBe(false)
  })
})
