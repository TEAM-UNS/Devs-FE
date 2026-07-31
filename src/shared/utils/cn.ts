import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

/**
 * `@theme`에서 만든 시맨틱 텍스트 스케일 (index.css의 `--text-*`).
 *
 * tailwind-merge는 Tailwind 기본 스케일(`text-sm` 등)만 알기 때문에 이 이름들을
 * 등록하지 않으면 `text-body-sm`을 **크기가 아니라 색으로 오해**한다. 그러면
 * `cn('text-body-sm', 'text-gray-400')`에서 크기 클래스가 조용히 삭제되고 기본
 * 16px로 렌더된다 (Chip `small`이 24px 높이에 16px 글자로 나오던 원인).
 */
const FONT_SIZES = [
  'display-lg',
  'display-md',
  'display-sm',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'body-lg',
  'body-md',
  'body-sm',
  'body-xs',
]

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [{ text: FONT_SIZES }],
    },
  },
})

/**
 * 조건부 className을 합치고 Tailwind 클래스 충돌을 해소한다.
 * clsx로 truthy 값만 모으고, tailwind-merge로 뒤 클래스가 앞을 덮게 해
 * 컴포넌트 기본 스타일을 소비자 `className`으로 안전하게 오버라이드할 수 있다.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
