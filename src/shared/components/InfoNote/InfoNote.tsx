import type { ReactNode } from 'react'
import { InfoCircleIcon } from '@/shared/components/icons'
import { cn } from '@/shared/utils/cn'

interface InfoNoteProps {
  /**
   * muted = 작은 회색 한 줄 (기본, 마이페이지 리포트 구독 카드의 발송 안내 모양)
   * emphasis = 보라 테두리 상자 — 놓치면 사용자가 막히는 안내(스팸함 확인 등)
   */
  readonly tone?: 'muted' | 'emphasis'
  readonly className?: string
  readonly children: ReactNode
}

/** i 아이콘이 붙은 안내 */
export function InfoNote({
  tone = 'muted',
  className,
  children,
}: InfoNoteProps) {
  const emphasis = tone === 'emphasis'

  return (
    <p
      className={cn(
        'flex gap-1.5',
        emphasis
          ? // 디자인 시안이 없어 정한 임시 값 — 보라 10% 바탕 + 40% 테두리
            'items-start rounded-sm border border-primary-500/40 bg-primary-500/10 px-3 py-2.5 text-body-sm text-white'
          : 'items-center text-body-xs text-gray-300',
        className,
      )}
    >
      <InfoCircleIcon
        className={cn(
          'size-4 shrink-0',
          // 여러 줄이 되면 아이콘이 첫 줄에 붙게 위치를 맞춘다
          emphasis && 'mt-0.5 text-primary-500',
        )}
      />
      <span>{children}</span>
    </p>
  )
}
