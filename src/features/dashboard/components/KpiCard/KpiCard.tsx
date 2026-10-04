import type { KpiMetric } from '../../types'
import { TrendMark } from '@/shared/components/TrendMark'

/**
 * 대시보드 상단 KPI 카드 — 제목 · 큰 값 · 증감 문구 · 우측 아이콘.
 * 값이 없는 상태는 `value`를 '-'로, 증감을 'flat'으로 넘겨 표현한다.
 */
export function KpiCard({
  label,
  value,
  unit,
  icon: Icon,
  caption,
  trend,
}: KpiMetric) {
  return (
    <article className="flex flex-col rounded-sm bg-container px-6 py-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-2">
          <div className="flex flex-col text-gray-1000">
            <h3 className="text-body-md">{label}</h3>
            <p className="flex items-center gap-1">
              <span className="text-h2">{value}</span>
              {unit && <span className="text-body-md">{unit}</span>}
            </p>
          </div>
          <p className="flex items-center gap-1.5 text-body-sm text-gray-400">
            {trend && <TrendMark direction={trend} />}
            <span>
              {caption.prefix}{' '}
              <span className="font-semibold">{caption.value}</span>
              {caption.suffix}
            </span>
          </p>
        </div>
        {/* 아이콘 슬롯 32px = 아이콘 24px + p-4 (Figma 274:1543) */}
        <span className="flex size-8 shrink-0 items-center justify-center overflow-clip rounded-xs p-1">
          <Icon className="size-6 text-gray-300" />
        </span>
      </div>
    </article>
  )
}
