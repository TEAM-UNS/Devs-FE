import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * 조건부 className을 합치고 Tailwind 클래스 충돌을 해소한다.
 * clsx로 truthy 값만 모으고, tailwind-merge로 뒤 클래스가 앞을 덮게 해
 * 컴포넌트 기본 스타일을 소비자 `className`으로 안전하게 오버라이드할 수 있다.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
