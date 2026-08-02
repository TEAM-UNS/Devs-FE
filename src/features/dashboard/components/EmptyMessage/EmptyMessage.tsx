import { cn } from '@/shared/utils/cn'

/**
 * 차트 영역의 데이터 없음 문구 — 영역을 그대로 채우고 가운데 정렬한다.
 * 색은 Figma 488:3603 기준(gray-200)으로 배경보다 조금만 밝다.
 */
export function EmptyMessage({ className }: { className?: string }) {
  return (
    <p
      className={cn(
        'flex items-center justify-center text-body-xs text-gray-200',
        className,
      )}
    >
      정보가 없습니다.
    </p>
  )
}
