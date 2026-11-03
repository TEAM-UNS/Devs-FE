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

describe('userIdFromToken', () => {
  // 서명은 보지 않으므로 가운데(payload)만 맞으면 된다
  const tokenWith = (payload: object) =>
    `header.${btoa(JSON.stringify(payload)).replaceAll('=', '')}.signature`

  it('토큰의 sub(사용자 id)를 꺼낸다', async () => {
    const { userIdFromToken } = await import('./amplitude')
    expect(userIdFromToken(tokenWith({ sub: '42', email: 'a@b.test' }))).toBe(
      '42',
    )
  })

  it('토큰이 없거나 모양이 다르거나 sub가 없으면 null', async () => {
    const { userIdFromToken } = await import('./amplitude')
    expect(userIdFromToken(null)).toBeNull()
    expect(userIdFromToken('not-a-jwt')).toBeNull()
    expect(userIdFromToken('a.%%%.c')).toBeNull()
    expect(userIdFromToken(tokenWith({ email: 'a@b.test' }))).toBeNull()
  })
})
