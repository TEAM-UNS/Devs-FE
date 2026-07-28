import { describe, expect, it } from 'vitest'
import { cn } from './cn'

describe('cn', () => {
  it('falsy 값을 걸러내고 truthy 클래스만 합친다', () => {
    expect(cn('a', false, null, undefined, 'b')).toBe('a b')
  })

  it('조건부 클래스를 지원한다', () => {
    const active = true
    const disabled = false
    expect(cn('base', active && 'on', disabled && 'off')).toBe('base on')
  })

  it('뒤 클래스가 앞의 충돌 Tailwind 클래스를 덮는다(tailwind-merge)', () => {
    expect(cn('h-8', 'h-9')).toBe('h-9')

    const merged = cn('px-4 py-2', 'px-6')
    expect(merged).toContain('px-6')
    expect(merged).toContain('py-2')
    expect(merged).not.toContain('px-4')
  })
})
