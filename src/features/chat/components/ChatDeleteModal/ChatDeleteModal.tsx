import { useEffect } from 'react'
import closeIcon from '@/assets/chat/close.svg'
import { Button } from '@/shared/components/Button'

interface ChatDeleteModalProps {
  readonly onCancel: () => void
  readonly onConfirm: () => void
}

/** 삭제 전에 복구할 수 없다는 안내와 취소 기회를 제공 */
export function ChatDeleteModal({ onCancel, onConfirm }: ChatDeleteModalProps) {
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') onCancel()
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [onCancel])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <button
        type="button"
        tabIndex={-1}
        aria-label="삭제 취소"
        className="absolute inset-0 size-full bg-black/35"
        onClick={onCancel}
      />
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="chat-delete-title"
        aria-describedby="chat-delete-description"
        className="relative flex w-[492px] flex-col gap-6 rounded-md bg-element px-9 pt-6 pb-9"
      >
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onCancel}
            aria-label="삭제 모달 닫기"
            className="flex size-6 items-center justify-center focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-primary-500"
          >
            <img src={closeIcon} alt="" className="size-6" />
          </button>
        </div>

        <div className="flex flex-col items-center gap-16">
          <div className="flex w-80 flex-col items-center gap-1 text-center">
            <h2 id="chat-delete-title" className="text-h2 text-white">
              정말 이 채팅을 삭제하시겠습니까?
            </h2>
            <p
              id="chat-delete-description"
              className="text-body-md text-gray-400"
            >
              삭제 이후에는 다시 복구할 수 없습니다.
            </p>
          </div>

          <div className="flex w-full gap-4">
            <Button
              variant="outline"
              className="flex-1 bg-element hover:bg-element active:bg-element"
              onClick={onCancel}
            >
              취소
            </Button>
            <Button
              className="flex-1 bg-error hover:bg-error active:bg-error"
              onClick={onConfirm}
            >
              삭제
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
