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
