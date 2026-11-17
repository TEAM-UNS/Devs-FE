import { useEffect, useRef } from 'react'
import { Button } from '@/shared/components/Button'

interface DeleteRoadmapModalProps {
  /** 지울 로드맵 이름 — 무엇을 지우는지 확인시킨다 */
  readonly name: string
  readonly deleting: boolean
  readonly onClose: () => void
  readonly onConfirm: () => void
}

/**
 * 로드맵 삭제 확인. 되돌릴 수 없어 한 번 묻는다
 * TODO: 디자인에 없는 모달. 완주 안내(FinishModal)와 같은 틀의 임시 화면
 */
export function DeleteRoadmapModal({
  name,
  deleting,
  onClose,
  onConfirm,
}: DeleteRoadmapModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    dialogRef.current?.showModal()
  }, [])

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      aria-labelledby="delete-roadmap-title"
      className="m-auto w-[492px] max-w-[calc(100%-2rem)] rounded-md bg-element p-0 backdrop:bg-black/35"
    >
      <div className="flex flex-col gap-10 px-9 py-9">
        <div className="flex flex-col items-center gap-1.5 text-center">
          <h2 id="delete-roadmap-title" className="text-h2 text-white">
            {name}을 삭제할까요?
          </h2>
          <p className="text-body-md text-gray-400">
            체크한 학습 항목과 진행률이 사라지고 되돌릴 수 없어요.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1">
            취소
          </Button>
          <Button onClick={onConfirm} disabled={deleting} className="flex-1">
            삭제
          </Button>
        </div>
      </div>
    </dialog>
  )
}
