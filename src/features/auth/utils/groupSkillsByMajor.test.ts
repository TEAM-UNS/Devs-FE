import { describe, expect, it } from 'vitest'
import { MOCK_MAJORS } from '@/test/fixtures/majors'
import { groupSkillsByMajor } from './groupSkillsByMajor'

describe('groupSkillsByMajor', () => {
  it('고른 스택을 내 전공별로 묶고 다른 전공은 뺀다', () => {
    expect(groupSkillsByMajor([101, 201], [1], MOCK_MAJORS.categories)).toEqual(
      { '1': ['101'] },
    )
  })

  it('한 스택이 여러 전공에 걸치면 각 전공에 모두 담는다', () => {
    const categories = [
      { id: 1, major: 'BACKEND', techStacks: [{ id: 9, name: 'Git' }] },
      { id: 2, major: 'FRONTEND', techStacks: [{ id: 9, name: 'Git' }] },
    ]

    expect(groupSkillsByMajor([9], [1, 2], categories)).toEqual({
      '1': ['9'],
      '2': ['9'],
    })
  })
})
