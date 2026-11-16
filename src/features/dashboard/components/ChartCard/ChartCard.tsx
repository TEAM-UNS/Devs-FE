import type { ReactNode } from 'react'
import { cn } from '@/shared/utils/cn'

interface ChartCardProps {
  title: string
  /** 제목 아래 설명. 없으면 제목만 둔다 — 액션이 넓은 카드(인기 기술 스택)에 자리를 내준다 */
  description?: string
  /** 헤더 우측 슬롯 — 필터 칩·기간 토글 등 */
  action?: ReactNode
  children: ReactNode
  /** 카드 골격(높이·헤더와 본문 사이 간격 등) 조정용 클래스 */
  className?: string
  /** 헤더(제목 + 액션) 배치 조정용 클래스 — 모바일에서 액션을 제목 아래로 내릴 때 */
  headerClassName?: string
}

/** 대시보드 차트 카드 껍데기 — 제목 · 설명 · 우측 액션 슬롯 + 본문. */
export function ChartCard({
  title,
  description,
  action,
  children,
  className,
  headerClassName,
}: ChartCardProps) {
  return (
    <section
      className={cn(
        // 모바일은 사방 20 (Figma 390 프레임)
        'flex flex-col gap-6 rounded-sm bg-container p-5 md:px-8 md:py-6',
        className,
      )}
    >
      <div
        className={cn(
          'flex items-start justify-between gap-4',
          headerClassName,
        )}
      >
        {/* 좁은 카드에서는 설명만 줄을 넘기고 제목은 한 줄로 둔다 */}
        <div className="flex min-w-0 flex-col">
          <h2 className="text-body-lg font-semibold whitespace-nowrap text-gray-1000">
            {title}
          </h2>
          {description && (
            <p className="text-body-sm text-gray-400">{description}</p>
          )}
        </div>
        {action}
      </div>
      {children}
    </section>
  )
}
