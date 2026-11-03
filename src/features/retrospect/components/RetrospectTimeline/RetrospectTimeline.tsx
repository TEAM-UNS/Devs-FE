import { cn } from '@/shared/utils/cn'
import type { Retrospect } from '../../types'
import { groupByMonth } from '../../utils/board'
import { RetrospectCard } from '../RetrospectCard'

interface RetrospectTimelineProps {
  readonly retrospects: readonly Retrospect[]
  readonly onOpen: (retrospect: Retrospect) => void
}

/**
 * 내 회고 세로 타임라인 — 월 머리글 아래로 카드가 시간축 좌우에 번갈아 붙는다
 * 좁은 화면은 시간축을 왼쪽에 두고 카드를 한 줄로 쌓는다
 * 디자인 시안 없이 정한 배치라 폭·간격은 임시 값이다
 */
export function RetrospectTimeline({
  retrospects,
  onOpen,
}: RetrospectTimelineProps) {
  return (
    <div className="relative mx-auto mt-12 w-full max-w-[880px] px-12">
      {/* 시간축 — 좁으면 왼쪽(점 칸 가운데), 넓으면 화면 가운데 */}
      <span
        aria-hidden="true"
        className="absolute inset-y-0 left-[63px] w-px bg-white/20 md:left-1/2"
      />
      <ol className="relative flex flex-col gap-10">
        {groupByMonth(retrospects).map(({ month, label, retrospects }) => (
          <li key={month} className="flex flex-col gap-6">
            <h3 className="self-start rounded-full border border-element bg-container px-4 py-1 text-body-md font-semibold text-white md:self-center">
              {label}
            </h3>
            <ol className="flex flex-col gap-6">
              {retrospects.map((retrospect, index) => {
                const left = index % 2 === 0
                return (
                  // 넓은 화면은 반대편 카드와 절반쯤 엇갈리게 끌어올려 빈 칸을 줄인다 (카드 180px)
                  <li
                    key={retrospect.retrospectId}
                    className="grid grid-cols-[32px_minmax(0,1fr)] md:grid-cols-[minmax(0,1fr)_48px_minmax(0,1fr)] md:not-first:-mt-[90px]"
                  >
                    <span
                      aria-hidden="true"
                      className="col-start-1 row-start-1 mt-[30px] size-2.5 justify-self-center rounded-full bg-primary-500 md:col-start-2"
                    />
                    <RetrospectCard
                      retrospect={retrospect}
                      onOpen={() => onOpen(retrospect)}
                      mine
                      className={cn(
                        'col-start-2 row-start-1 w-full',
                        left ? 'md:col-start-1' : 'md:col-start-3',
                      )}
                    />
                  </li>
                )
              })}
            </ol>
          </li>
        ))}
      </ol>
    </div>
  )
}
