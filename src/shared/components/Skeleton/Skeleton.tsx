import { cn } from '@/shared/utils/cn'

interface SkeletonProps {
  /** 크기·모양은 쓰는 쪽이 정한다 (예: 'h-6 w-32', 'size-10 rounded-full') */
  readonly className?: string
}

/**
 * 데이터를 불러오는 동안 내용 자리를 채우는 회색 블록
 * 디자인 시안이 없어 정한 임시 값 — 카드(container) 위에서 보이도록 element 색 + 깜빡임 (#65)
 * 읽을 내용이 없어 보조 기술에서는 숨긴다. 로딩 안내는 감싸는 쪽이 맡는다
 */
export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'rounded-sm bg-element motion-safe:animate-pulse',
        className,
      )}
    />
  )
}
