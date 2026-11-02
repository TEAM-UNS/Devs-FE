import { useEffect, useRef } from 'react'
import { CloseIcon } from '@/shared/components/icons'
import type { Retrospect } from '../../types'
import { formatBoardDate, retrospectTitle } from '../../utils/board'
import { LikeButton } from '../LikeButton'

interface RetrospectDetailModalProps {
  readonly retrospect: Retrospect
  readonly onClose: () => void
  /** 내 회고 — 제목을 '내 로드맵'으로 부르고 좋아요는 개수만 보여준다 */
  readonly mine?: boolean
}

/**
 * 회고 상세 — Figma 2079:12530
 * 로드맵 회고 작성 모달(RetrospectModal)과 틀이 같다. #141과 충돌을 피하려 지금은 따로 두고,
 * 둘 다 머지되면 공용 Dialog로 합친다
 */
export function RetrospectDetailModal({
  retrospect,
  onClose,
  mine = false,
}: RetrospectDetailModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const title = retrospectTitle(retrospect.dayNo, mine)

  useEffect(() => {
    dialogRef.current?.showModal()
  }, [])

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      aria-labelledby="retrospect-detail-title"
      // Figma 배경: 검정 45% + 배경 블러 6 (로드맵 회고 모달과 같다)
      className="m-auto w-[800px] max-w-[calc(100%-2rem)] rounded-md border border-element bg-container px-6 pt-6 pb-9 backdrop:bg-black/45 backdrop:backdrop-blur-[6px]"
    >
      <div className="flex flex-col items-center gap-5">
        <div className="flex w-full justify-end">
          <button
            type="button"
            onClick={onClose}
            aria-label="회고 닫기"
            className="size-6 text-gray-300 hover:text-gray-400"
          >
            <CloseIcon className="size-6" />
          </button>
        </div>
        <div className="flex w-[657px] max-w-full flex-col gap-1">
          <div className="flex flex-col items-center gap-6">
            <h2 id="retrospect-detail-title" className="text-h2 text-white">
              {title}
            </h2>
            <p className="h-[300px] w-full overflow-y-auto rounded-md border border-element bg-canvas px-6 py-5 text-body-sm whitespace-pre-line text-white">
              {retrospect.content}
            </p>
          </div>
          <div className="flex items-center justify-between py-1.5">
            <span className="text-body-sm text-gray-400">
              {formatBoardDate(retrospect.date)}
            </span>
            <LikeButton retrospect={retrospect} readOnly={mine} />
          </div>
        </div>
      </div>
    </dialog>
  )
}
