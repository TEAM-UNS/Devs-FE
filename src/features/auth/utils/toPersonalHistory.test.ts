import { describe, expect, it } from 'vitest'
import { fromPersonalHistory, toPersonalHistory } from './toPersonalHistory'

describe('fromPersonalHistory', () => {
  it('경력 없음은 연차 없이 되돌린다', () => {
    expect(fromPersonalHistory('NO_EXPERIENCE')).toEqual({ careerType: 'none' })
  })

  it.each(['ENTRY_LEVEL', 'JUNIOR', 'MIDDLE', 'SENIOR'] as const)(
    '%s는 toPersonalHistory로 다시 같은 값이 된다',
    (history) => {
      expect(toPersonalHistory(fromPersonalHistory(history))).toBe(history)
    },
  )
})
