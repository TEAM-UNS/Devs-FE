import type { ReactNode } from 'react'
import { cn } from '@/shared/utils/cn'

interface CompareSectionCardProps {
  readonly title: string
  /** 제목 오른쪽 (범례 등) */
  readonly aside?: ReactNode
  readonly className?: string
  readonly children: ReactNode
}

/** 비교 결과의 카드 한 장 — container 배경, 좌우 24·위아래 20, 제목 18px SemiBold */
export function CompareSectionCard({
  title,
  aside,
  className,
  children,
}: CompareSectionCardProps) {
  return (
    <section
      className={cn(
        'flex flex-col gap-4 rounded-sm bg-container px-6 py-5',
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-body-lg font-semibold text-gray-1000">{title}</h2>
        {aside}
      </div>
      {children}
    </section>
  )
}
