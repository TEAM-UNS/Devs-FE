import type { KpiMetric } from '../../types'
import { TrendMark } from '@/shared/components/TrendMark'

/**
 * 대시보드 상단 KPI 카드 — 제목 · 큰 값 · 증감 문구 · 아이콘 (좁으면 위, 넓으면 오른쪽).
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
    <article className="flex flex-col rounded-sm bg-container px-5 py-4 md:px-6">
      {/* 아이콘을 코드 뒤에 두고 좁을 때만 위로 올린다. 제목부터 읽히게
          Figma 834는 아이콘이 오른쪽이지만 실제 문구('전일 대비 -173건')가 예시보다 길어
          카드 폭이 218px(화면 약 1280px)는 돼야 옆에 들어간다. 그 전까지는 모바일처럼 위에 둔다 */}
      <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between xl:gap-2">
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
        <span className="order-first flex size-8 shrink-0 items-center justify-center overflow-clip rounded-xs p-1 xl:order-none">
          <Icon className="size-6 text-gray-300" />
        </span>
      </div>
    </article>
  )
}
