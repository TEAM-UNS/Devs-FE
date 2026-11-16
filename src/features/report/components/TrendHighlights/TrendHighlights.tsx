import type { MentionBar, TrendHighlight } from '../../types'
import { MentionChart } from '../MentionChart'
import { ReportKpiCard } from '../ReportKpiCard'

interface TrendHighlightsProps {
  highlights: readonly TrendHighlight[]
  mentions: readonly MentionBar[]
}

/**
 * 이번 주 주목할 만한 기술 트렌드 — 최대 상승·하락 카드와 언급량 차트가 들어가는 블록.
 *
 * @param highlights 강조 카드 목록 (디자인은 2장)
 * @param mentions 언급량 차트 데이터
 */
export function TrendHighlights({
  highlights,
  mentions,
}: TrendHighlightsProps) {
  return (
    // 2단일 때 순위 블록(293 고정)을 뺀 나머지 폭 (StackRankList 참고)
    <section className="flex min-w-0 flex-col gap-4 @3xl:flex-1">
      <h2 className="text-body-lg font-semibold text-gray-1000">
        이번 주 주목할 만한 기술 트렌드
      </h2>

      <div className="flex flex-col gap-6">
        <div className="flex gap-3">
          {highlights.map((highlight) => (
            <ReportKpiCard key={highlight.label} {...highlight} />
          ))}
        </div>

        <MentionChart bars={mentions} />
      </div>
    </section>
  )
}
