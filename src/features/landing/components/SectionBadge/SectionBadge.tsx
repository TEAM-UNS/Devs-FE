import type { ReactNode } from 'react'
import { cn } from '@/shared/utils/cn'

interface SectionBadgeProps {
  children: ReactNode
  className?: string
}

/** 섹션 머리의 보라색 알약 라벨 (기능 이름 · 로고 띠 카피) */
export function SectionBadge({ children, className }: SectionBadgeProps) {
  return (
    <span
      className={cn(
        'rounded-full bg-primary-400 px-5 py-1.5 text-body-md font-semibold text-white',
        className,
      )}
    >
      {children}
    </span>
  )
}
