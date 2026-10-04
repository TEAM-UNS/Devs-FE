import type { ReactNode } from 'react'
import { cn } from '@/shared/utils/cn'

interface ChartCardProps {
  title: string
  description: string
  /** 헤더 우측 슬롯 — 필터 칩·기간 토글 등 */
  action?: ReactNode
  children: ReactNode
  /** 카드 골격(높이·헤더와 본문 사이 간격 등) 조정용 클래스 */
  className?: string
}

/** 대시보드 차트 카드 껍데기 — 제목 · 설명 · 우측 액션 슬롯 + 본문. */
export function ChartCard({
  title,
  description,
  action,
  children,
  className,
}: ChartCardProps) {
  return (
    <section
      className={cn(
        'flex flex-col gap-6 rounded-sm bg-container px-8 py-6',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col">
          <h2 className="text-body-lg font-semibold text-gray-1000">{title}</h2>
          <p className="text-body-sm text-gray-400">{description}</p>
        </div>
        {action}
      </div>
      {children}
    </section>
  )
}
