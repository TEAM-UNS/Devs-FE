import { TrendMark, type TrendDirection } from '@/shared/components/TrendMark'
import { cn } from '@/shared/utils/cn'
import type { StackRank } from '../../types'

interface StackRankListProps {
  ranks: readonly StackRank[]
}

// 증감 숫자 색 — 방향별로 삼각형과 같은 색을 쓴다 (Figma 335:2280).
// 변동 없음은 건수와 같은 회색이라 눈에 띄지 않는다.
const DELTA_COLOR: Record<TrendDirection, string> = {
  up: 'text-error',
  down: 'text-info',
  flat: 'text-gray-400',
}

/**
 * 가장 많이 찾은 기술 스택 순위. 왼쪽에 순위·이름, 오른쪽에 건수·증감이 붙는다.
 *
 * 순번을 데이터가 아니라 배열 인덱스로 만드는 이유: 목록 순서가 곧 순위라서
 * 둘이 어긋날 여지를 두지 않는다.
 *
 * @param ranks 순위 순서대로 정렬된 스택 목록
 */
export function StackRankList({ ranks }: StackRankListProps) {
  return (
    /* 2단일 때 폭 293 고정, 남는 폭은 옆 트렌드 블록이 가진다 (Figma 1920 1396:6267 · 프리뷰 카드 모두)
       1단은 카드 폭을 다 쓴다 (ReportCard의 @container) */
    <section className="flex min-w-0 flex-col gap-4 @3xl:w-[293px] @3xl:shrink-0">
      <h2 className="text-body-lg font-semibold text-gray-1000">
        가장 많이 찾은 기술 스택
      </h2>

      <ol className="flex flex-col gap-2">
        {ranks.map(({ id, name, count, trend, delta }, index) => (
          <li key={id} className="flex h-6 items-center justify-between">
            <span className="flex min-w-0 items-center gap-2">
              <span className="text-body-xs text-gray-400">
                {String(index + 1).padStart(2, '0')}
              </span>
              {/* 좁아지면 이름이 건수를 밀어내지 않도록 말줄임 */}
              <span className="truncate text-body-sm font-semibold text-gray-1000">
                {name}
              </span>
            </span>

            <span className="flex shrink-0 items-center gap-3">
              <span className="text-body-xs text-gray-400">
                {count.toLocaleString()}건
              </span>
              <span
                className={cn(
                  'flex items-center gap-1 text-body-xs',
                  DELTA_COLOR[trend],
                )}
              >
                <TrendMark direction={trend} />
                {delta}
              </span>
            </span>
          </li>
        ))}
      </ol>
    </section>
  )
}
