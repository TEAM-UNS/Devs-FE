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

  it('@theme 커스텀 텍스트 스케일을 색 클래스와 함께 써도 살아남는다', () => {
    // tailwind-merge에 우리 font-size 스케일을 등록하지 않으면 text-body-sm이
    // 색으로 오해받아 삭제된다 (Chip small이 16px로 렌더되던 회귀).
    const merged = cn('text-body-sm', 'text-gray-400')
    expect(merged).toContain('text-body-sm')
    expect(merged).toContain('text-gray-400')
  })

  it('같은 그룹의 텍스트 크기끼리는 뒤 것이 앞을 덮는다', () => {
    expect(cn('text-body-md', 'text-body-sm')).toBe('text-body-sm')
    expect(cn('text-h2', 'text-display-lg')).toBe('text-display-lg')
  })
})
