import { describe, expect, it } from 'vitest'
import type { UserMyQueryResponse } from '../types'
import { toMyProfile } from './toMyProfile'

const RESPONSE: UserMyQueryResponse = {
  name: '최하은',
  email: 'user@example.com',
  personalHistory: 'JUNIOR',
  majors: [
    { majorId: 1, majorName: '백엔드' },
    { majorId: 2, majorName: '프론트엔드' },
  ],
  techStacks: [
    { skillId: 11, skillName: 'React' },
    { skillId: 12, skillName: 'TypeScript' },
  ],
}

describe('toMyProfile', () => {
  it('경력 ENUM을 회원가입 구간에 맞춘 문구로 바꾼다', () => {
    expect(toMyProfile(RESPONSE).career).toBe('1~3년 차 (주니어)')
    expect(
      toMyProfile({ ...RESPONSE, personalHistory: 'NO_EXPERIENCE' }).career,
    ).toBe('경력 없음')
  })

  it('전공은 쉼표로 잇고 기술 스택은 이름만 남긴다', () => {
    const profile = toMyProfile(RESPONSE)

    expect(profile.majors).toBe('백엔드, 프론트엔드')
    expect(profile.skills).toEqual(['React', 'TypeScript'])
  })

  it('전공·기술 스택이 비어 있으면 빈 값이 된다', () => {
    const profile = toMyProfile({ ...RESPONSE, majors: [], techStacks: [] })

    expect(profile.majors).toBe('')
    expect(profile.skills).toEqual([])
  })
})
