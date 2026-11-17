import { cn } from '@/shared/utils/cn'

interface SkeletonProps {
  /** 크기·모양은 쓰는 쪽이 정한다 (예: 'h-6 w-32', 'size-10 rounded-full') */
  readonly className?: string
}

// 지나가는 빛 — 가운데만 살짝 밝은 띠. 바탕색과 따로 두어 쓰는 쪽이 bg-*로 색만 바꿔도 빛은 그대로 지나간다
const SHIMMER =
  'bg-[linear-gradient(90deg,transparent,rgb(255_255_255/0.08),transparent)] bg-size-[200%_100%] bg-no-repeat motion-safe:animate-shimmer'

/**
 * 데이터를 불러오는 동안 내용 자리를 채우는 블록
 * 사이드바 배경 회색(container) 위로 빛이 지나간다 — 디자이너 답변 기준, 시안은 아직 없다 (#254)
 * 움직임 줄이기 설정이면 멈춘 블록만 남는다
 * 읽을 내용이 없어 보조 기술에서는 숨긴다. 로딩 안내는 감싸는 쪽이 맡는다
 */
export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn('rounded-sm bg-container', SHIMMER, className)}
    />
  )
}
