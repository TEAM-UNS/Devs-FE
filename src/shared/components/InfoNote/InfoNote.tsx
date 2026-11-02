import type { ReactNode } from 'react'
import { InfoCircleIcon } from '@/shared/components/icons'
import { cn } from '@/shared/utils/cn'

interface InfoNoteProps {
  readonly className?: string
  readonly children: ReactNode
}

/** i 아이콘이 붙은 작은 회색 안내 한 줄 — 마이페이지 리포트 구독 카드의 발송 안내 모양 */
export function InfoNote({ className, children }: InfoNoteProps) {
  return (
    <p
      className={cn(
        'flex items-center gap-1.5 text-body-xs text-gray-300',
        className,
      )}
    >
      <InfoCircleIcon className="size-4 shrink-0" />
      {children}
    </p>
  )
}
