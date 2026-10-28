import { useEffect, useRef, type FormEvent } from 'react'
import { Button } from '@/shared/components/Button'
import { CloseIcon } from '@/shared/components/icons'
import { RETROSPECT_MAX_LENGTH } from '../../constants/create'

interface RetrospectModalProps {
  readonly title: string
  /** 보내는 중이면 작성완료를 잠가 두 번 보내지 않게 한다 */
  readonly submitting: boolean
  readonly onClose: () => void
  readonly onSubmit: (retrospect: string) => void
}

/**
 * 하루를 마치며 쓰는 회고 — Figma 2079:9900
 * 네이티브 dialog의 showModal로 띄워 포커스 가두기·Esc 닫기·배경 비활성을 브라우저에 맡긴다
 */
export function RetrospectModal({
  title,
  submitting,
  onClose,
  onSubmit,
}: RetrospectModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    dialogRef.current?.showModal()
  }, [])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const retrospect = new FormData(event.currentTarget).get('retrospect')
    onSubmit(typeof retrospect === 'string' ? retrospect : '')
  }

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      aria-labelledby="retrospect-title"
      // Figma 배경: 검정 45% + 배경 블러 6
      className="m-auto w-[800px] max-w-[calc(100%-2rem)] rounded-md border border-element bg-container px-6 pt-6 pb-9 backdrop:bg-black/45 backdrop:backdrop-blur-[6px]"
    >
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-5"
      >
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

        <div className="flex w-[657px] max-w-full flex-col items-center gap-9">
          <div className="flex w-full flex-col items-center gap-6">
            <div className="flex flex-col items-center gap-1 text-center">
              <h2 id="retrospect-title" className="text-h2 text-white">
                {title}
              </h2>
              <p className="text-body-md text-gray-400">
                오늘의 회고는 익명으로 게시판에 공유돼요. (선택 작성)
              </p>
            </div>
            <textarea
              name="retrospect"
              aria-label="회고"
              maxLength={RETROSPECT_MAX_LENGTH}
              className="h-[300px] w-full resize-none rounded-md border border-element bg-canvas px-6 py-5 text-body-md text-white outline-none focus:border-gray-300"
            />
          </div>

          <div className="flex w-full gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 bg-element"
            >
              취소
            </Button>
            <Button type="submit" disabled={submitting} className="flex-1">
              작성완료
            </Button>
          </div>
        </div>
      </form>
    </dialog>
  )
}
