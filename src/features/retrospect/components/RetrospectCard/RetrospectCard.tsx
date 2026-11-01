import { cn } from '@/shared/utils/cn'
import type { Retrospect } from '../../types'
import { formatBoardDate, retrospectTitle } from '../../utils/board'
import { LikeButton } from '../LikeButton'

interface RetrospectCardProps {
  readonly retrospect: Retrospect
  readonly onOpen: () => void
}

/* Figma 유리 카드(2079:10595). GLASS 효과의 굴절·분산은 CSS로 못 만들어서
   흰 6% 채움 + 배경 블러로 뒤 배경이 비치게 하고, 테두리는 대각선 흰 그라데이션(45%)으로 빛을 흉내 낸다
   그라데이션 테두리는 border로 못 그려서 패딩 1px 의사 요소에 마스크로 가운데를 뚫는다
   Figma 테두리는 안쪽(INSIDE)이라 내용이 21px부터 시작한다 → 패딩 21px */
const GLASS = cn(
  'bg-white/6 backdrop-blur-md',
  'before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:p-px before:opacity-45',
  'before:bg-[linear-gradient(135deg,rgb(255_255_255/0.85),rgb(255_255_255/0.12)_50%,rgb(255_255_255/0.6))]',
  // 합성 방식(exclude)을 mask 축약형 안에 둔다. 따로 쓰면 뒤에 오는 축약형이 기본값(add)으로 덮어 가운데가 안 뚫린다
  'before:[mask:linear-gradient(#000_0_0)_content-box_exclude,linear-gradient(#000_0_0)]',
)

/** 회고 카드 — 제목·내용 3줄·날짜·좋아요. 누르면 상세 모달 */
export function RetrospectCard({ retrospect, onOpen }: RetrospectCardProps) {
  const title = retrospectTitle(retrospect.dayNo)

  return (
    <article
      className={cn(
        'relative flex h-[180px] w-[360px] shrink-0 flex-col justify-between rounded-md p-[21px]',
        GLASS,
        // Figma 주석 "호버 시 위로 약간 올라가는 애니메이션"
        'motion-safe:transition-transform motion-safe:duration-fast motion-safe:ease-standard motion-safe:hover:-translate-y-1',
      )}
    >
      {/* 카드 전체를 누르게 하되 좋아요 버튼과 겹치지 않게 덮개 버튼을 깔아 둔다 */}
      <button
        type="button"
        onClick={onOpen}
        aria-label={`${title} 회고 보기`}
        className="absolute inset-0 rounded-[inherit] focus-visible:outline-2 focus-visible:outline-primary-500"
      />
      <div className="flex min-h-0 flex-col gap-3">
        <h3 className="truncate text-body-lg font-semibold text-white">
          {title}
        </h3>
        {/* Figma 주석 "최대 3줄 노출 후 ... 처리" */}
        <p className="line-clamp-3 text-body-sm whitespace-pre-line text-white">
          {retrospect.content}
        </p>
      </div>
      <div className="flex items-center justify-between py-1.5">
        <span className="text-body-sm text-gray-400">
          {formatBoardDate(retrospect.date)}
        </span>
        <LikeButton liked={retrospect.liked} count={retrospect.likeCount} />
      </div>
    </article>
  )
}
