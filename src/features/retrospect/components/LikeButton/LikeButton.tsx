import { HeartIcon } from '@/shared/components/icons'
import { useToggleLike } from '../../hooks/useToggleLike'
import type { Retrospect } from '../../types'

interface LikeButtonProps {
  readonly retrospect: Retrospect
  readonly tabIndex?: number
}

/** 좋아요 하트 + 개수 — Figma 2079:11769. 보내는 동안은 이 버튼만 잠근다 */
export function LikeButton({ retrospect, tabIndex }: LikeButtonProps) {
  const toggle = useToggleLike()
  const { retrospectId, liked, likeCount } = retrospect

  return (
    <button
      type="button"
      aria-pressed={liked}
      tabIndex={tabIndex}
      aria-label={`좋아요 ${likeCount}개`}
      disabled={toggle.isPending}
      onClick={() => toggle.mutate({ retrospectId, liked })}
      className="relative z-10 flex items-center gap-1 rounded-sm text-body-sm text-gray-400 focus-visible:outline-2 focus-visible:outline-primary-500 disabled:cursor-wait"
    >
      <HeartIcon filled={liked} className="size-6 text-white" />
      {likeCount}
    </button>
  )
}
