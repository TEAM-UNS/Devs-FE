import { HeartIcon } from '@/shared/components/icons'

interface LikeButtonProps {
  readonly liked: boolean
  readonly count: number
  readonly tabIndex?: number
}

/** 좋아요 하트 + 개수 — Figma 2079:11769 */
export function LikeButton({ liked, count, tabIndex }: LikeButtonProps) {
  return (
    <button
      type="button"
      aria-pressed={liked}
      tabIndex={tabIndex}
      aria-label={`좋아요 ${count}개`}
      // TODO: API 연동 — 누르면 POST /like/{retrospectId}, 취소는 DELETE
      className="relative z-10 flex items-center gap-1 rounded-sm text-body-sm text-gray-400 focus-visible:outline-2 focus-visible:outline-primary-500"
    >
      <HeartIcon filled={liked} className="size-6 text-white" />
      {count}
    </button>
  )
}
