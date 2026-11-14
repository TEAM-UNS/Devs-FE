import { useEffect, useRef } from 'react'
import { Button } from '@/shared/components/Button'
import { CloseIcon } from '@/shared/components/icons'

interface FinishModalProps {
  readonly onClose: () => void
  /** 확인 — 새 로드맵 만들기로 보낸다 */
  readonly onConfirm: () => void
}

/**
 * 로드맵 완주 뒤 마지막 안내 — Figma 2398:32912
 * 회고 모달처럼 네이티브 dialog의 showModal로 띄운다. Figma 주석 "35% 딤 처리 후 정 중앙"
 */
export function FinishModal({ onClose, onConfirm }: FinishModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    dialogRef.current?.showModal()
  }, [])

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      aria-labelledby="finish-title"
      className="m-auto w-[492px] max-w-[calc(100%-2rem)] rounded-md bg-element p-0 backdrop:bg-black/35"
    >
      <div className="flex flex-col gap-6 px-9 pt-6 pb-9">
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            aria-label="안내 닫기"
            className="size-6 text-gray-300 hover:text-gray-400"
          >
            <CloseIcon className="size-6" />
          </button>
        </div>

        <div className="flex flex-col gap-16">
          <div className="flex flex-col items-center gap-1.5 text-center">
            <h2 id="finish-title" className="text-h2 text-white">
              이제 새로운 로드맵을 시작할 수 있어요.
            </h2>
            {/* Figma 줄바꿈 그대로. 좁으면 알아서 더 접힌다 */}
            <p className="text-body-md whitespace-pre-line text-gray-400">
              {
                '마무리된 회고들은 [마이페이지 > 내 회고 보기]에\n안전하게 보관되며, 언제든 다시 꺼내볼 수 있어요.'
              }
            </p>
          </div>
          <Button onClick={onConfirm} className="w-full">
            확인
          </Button>
        </div>
      </div>
    </dialog>
  )
}
