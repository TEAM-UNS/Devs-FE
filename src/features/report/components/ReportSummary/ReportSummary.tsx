import type { WeekRange } from '../../types'

interface ReportSummaryProps {
  /** 응답 전에는 없다 */
  week?: WeekRange
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
  // 연도도 서버 값을 쓴다. 해가 바뀌는 주는 목요일이 속한 해로 센다
  const weekName = week ? `${week.year}년 ${week.label}` : ''

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
          <h2 className="shrink-0 text-body-lg font-semibold text-gray-1000">
            [AI 리포트] {weekName} 요약
          </h2>
          <p className="scrollbar-slim min-h-0 flex-1 overflow-y-auto whitespace-pre-line wrap-anywhere text-body-sm text-gray-600">
            {paragraphs.join('\n')}
          </p>
        </>
      )}
    </section>
  )
}
