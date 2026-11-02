import { describe, expect, it } from 'vitest'
import { fetchFlag, flagsEnabled } from './amplitude'

describe('원격 플래그', () => {
  // 테스트는 개발 빌드라 initAmplitude가 초기화를 건너뛴다
  it('Amplitude를 켜지 않았으면 플래그를 못 쓰고, 기다리지 않고 null을 준다', async () => {
    expect(flagsEnabled()).toBe(false)
    await expect(
      fetchFlag('dashboard-filter-memory', 10_000),
    ).resolves.toBeNull()
  })
})

describe('플래그 캐시', () => {
  it('받은 적 없으면 null, 빈 값은 variant 없음(undefined)으로 읽는다', async () => {
    const { readCachedFlag } = await import('./amplitude')
    localStorage.removeItem('uns-flag:test-flag')
    expect(readCachedFlag('test-flag')).toBeNull()

    localStorage.setItem('uns-flag:test-flag', '')
    expect(readCachedFlag('test-flag')).toBeUndefined()

    localStorage.setItem('uns-flag:test-flag', 'on')
    expect(readCachedFlag('test-flag')).toBe('on')
  })
})
