import type { WeekReport } from '../../types'
import { ReportSummary } from '../ReportSummary'
import { StackRankList } from '../StackRankList'
import { TrendHighlights } from '../TrendHighlights'

type ReportCardProps = Pick<
  WeekReport,
  'week' | 'ranks' | 'highlights' | 'mentions' | 'summary'
>

/* 이번 주 카드의 표면 — Figma 335:2275.
   채움 #25292d(container) · 테두리 #343a40(element) 1px INSIDE ·
   그림자 blur 12 · offset(7,14) · 검정 15%.

   그림자는 `--shadow-report-card` 토큰을 쓴다. 주차를 넘길 때 `slide-in` 키프레임이
   같은 값으로 도착해야 해서 두 곳이 한 값을 봐야 한다(index.css의 토큰 주석 참고).

   ⚠️ 좌우 프리뷰 카드(335:2517 · 329:1217)는 **표면이 다르다** — 채움이 한 단계 밝은
   #343a40이고 테두리·그림자가 없다. 그래서 표면과 내용을 나눠 두고, 프리뷰는
   `ReportCardBody`만 가져다 쓴다. */
// 안쪽 여백은 Figma 모바일 32 · 패드 36 · PC 48
const SURFACE = [
  'rounded-md bg-container p-8 md:p-9 lg:p-12',
  'ring-1 ring-inset ring-element',
  'shadow-report-card',
].join(' ')

/**
 * 리포트 카드의 내용만. 표면(배경·테두리·여백)은 감싸는 쪽이 정한다.
 *
 * 이번 주 카드와 좌우 프리뷰 카드가 같은 내용을 쓰되 표면이 달라서 나눠 뒀다.
 */
export function ReportCardBody({
  week,
  ranks,
  highlights,
  mentions,
  summary,
}: ReportCardProps) {
  return (
    /* data-card-body: 주차를 넘길 때 WeekDeck이 이 내용의 밝기를 함께 낮춘다.
       이웃 자리의 내용은 20%인데 여기서 멈춰 있으면 도착하는 순간 5배 어두워진다. */
    /* @container: 2단·1단을 화면 폭이 아니라 카드 안쪽 폭으로 고른다. 좌우 프리뷰 카드는
       화면이 좁아도 안쪽 폭이 876으로 고정이라 PC처럼 2단으로 보여야 하고(Figma 패드·모바일도 그렇다),
       이번 주 카드는 1024~1279에서 사이드바 때문에 2단이 들어갈 폭(768)이 안 나온다 */
    <div data-card-body className="@container">
      {/* 간격은 Figma PC 24·48, 패드·모바일 36 */}
      <div className="flex flex-col gap-9 @3xl:gap-6">
        <div className="flex flex-col gap-9 @3xl:flex-row @3xl:gap-12">
          <StackRankList ranks={ranks} />
          <TrendHighlights highlights={highlights} mentions={mentions} />
        </div>

        <ReportSummary week={week} paragraphs={summary} />
      </div>
    </div>
  )
}

/**
 * 이번 주 리포트 카드. 순위·트렌드·언급량·요약이 한 장에 들어간다.
 * PC 폭은 최대 1140(Figma 1920 1396:6267, radius 12)이고 폭은 감싸는 WeekDeck이 정한다.
 */
export function ReportCard(props: ReportCardProps) {
  return (
    /* data-surface: 주차를 넘길 때 WeekDeck이 이 표면의 색·그림자를 함께 애니메이션한다.
       태그(`section`)로 집으면 태그를 바꾸는 순간 조용히 끊긴다. */
    <section data-surface="card" className={SURFACE}>
      <ReportCardBody {...props} />
    </section>
  )
}
