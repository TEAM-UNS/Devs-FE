import { TrendMark } from '@/shared/components/TrendMark'
import type { TrendHighlight } from '../../types'

/**
 * 주목할 만한 트렌드 카드 — 제목·기술 이름과 오른쪽 위 증감률.
 *
 * 대시보드 `KpiCard`와 이름은 비슷하지만 다른 컴포넌트다. 그쪽은 아이콘 슬롯과 하단
 * 보조 문구가 있고 배경이 `bg-container`인데, 이 카드는 아이콘·문구가 없고 배경이
 * 한 단계 밝은 `bg-element`다(Figma 335:2355 = #343a40). 공용화하면 두 디자인의
 * 차이가 전부 prop 분기로 들어와서 나누어 두었다.
 *
 * @param label 카드 제목 (예: `이번주 최대 상승`)
 * @param name 기술 이름
 * @param trend 증감 방향
 * @param percent 증감률 — 양수면 `+`를 붙인다
 */
export function ReportKpiCard({ label, name, trend, percent }: TrendHighlight) {
  return (
    <article className="flex min-w-0 flex-1 items-start justify-between gap-2 rounded-sm bg-element px-5 py-4">
      {/* 제목과 이름은 붙어 있다 (Figma gap 0) */}
      <div className="flex min-w-0 flex-col">
        <span className="text-body-sm text-gray-1000">{label}</span>
        <strong className="truncate text-h3 text-gray-1000">{name}</strong>
      </div>

      <p className="flex shrink-0 items-center gap-1.5 text-body-sm font-semibold text-gray-400">
        <TrendMark direction={trend} />
        <span>
          {percent > 0 && '+'}
          {percent}
          <span className="text-body-xs">%</span>
        </span>
      </p>
    </article>
  )
}
