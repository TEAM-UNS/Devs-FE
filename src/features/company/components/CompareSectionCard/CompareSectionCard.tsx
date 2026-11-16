import type { ReactNode } from 'react'
import { Skeleton } from '@/shared/components/Skeleton'
import { cn } from '@/shared/utils/cn'

interface CompareSectionCardProps {
  readonly title: string
  /** 제목 오른쪽 (범례 등) */
  readonly aside?: ReactNode
  readonly className?: string
  /** 응답 전이면 내용 자리에 스켈레톤을 둔다. 제목은 그대로 보인다 */
  readonly loading?: boolean
  /** 스켈레톤 높이 — 카드마다 내용 높이가 달라 쓰는 쪽이 정한다 */
  readonly skeletonClassName?: string
  readonly children: ReactNode
}

/** 비교 결과의 카드 한 장 — container 배경, 좌우 24·위아래 20, 제목 18px SemiBold */
export function CompareSectionCard({
  title,
  aside,
  className,
  loading = false,
  skeletonClassName,
  children,
}: CompareSectionCardProps) {
  return (
    <section
      className={cn(
        'flex flex-col gap-4 rounded-sm bg-container px-6 py-5',
        className,
      )}
    >
      {/* 모바일은 범례가 제목 아래로 내려간다 (Figma 2339:16962, 간격 4) */}
      <div className="flex items-center justify-between max-md:flex-col max-md:items-start max-md:gap-1">
        <h2 className="text-body-lg font-semibold text-gray-1000">{title}</h2>
        {aside}
      </div>
      {loading ? (
        <Skeleton className={cn('h-40', skeletonClassName)} />
      ) : (
        children
      )}
    </section>
  )
}
