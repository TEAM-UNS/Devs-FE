import type { WeekRange } from '../../types'

interface ReportSummaryProps {
  week: WeekRange
  paragraphs: readonly string[]
}

const SURFACE = 'flex h-48 rounded-sm bg-canvas p-6'

/**
 * 카드 하단 AI 요약 리포트 영역
 *
 * @param week 제목·빈 상태 문구에 넣을 주차
 * @param paragraphs 요약 문단들
 */
export function ReportSummary({ week, paragraphs }: ReportSummaryProps) {
  const weekName = `${week.start.slice(0, 4)}년 ${week.label}`

  return (
    <section
      aria-label="요약 리포트"
      data-surface="panel"
      className={
        paragraphs.length === 0
          ? `${SURFACE} items-center justify-center`
          : `${SURFACE} flex-col gap-3`
      }
    >
      {paragraphs.length === 0 ? (
        <p className="text-body-sm text-gray-200">
          {weekName} 요약 리포트가 없습니다.
        </p>
      ) : (
        <>
          <h2 className="text-body-lg font-semibold text-gray-1000">
            [AI 리포트] {weekName} 요약
          </h2>
          <p className="line-clamp-5 whitespace-pre-line text-body-sm text-gray-600">
            {paragraphs.join('\n')}
          </p>
        </>
      )}
    </section>
  )
}
