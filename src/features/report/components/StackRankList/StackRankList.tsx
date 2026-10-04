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
    /* flex-[293]: Figma 폭 293을 그대로 grow 비율로 쓴다. 옆 블록이 541이라
       둘의 합(834)이 1440에서의 가용 폭과 같아 디자인 값이 정확히 재현되고,
       폭이 줄어도 293:541 비례가 유지된다. min-w-0이 없으면 내용 폭 아래로 안 줄어든다. */
    <section className="flex min-w-0 flex-[293] flex-col gap-4">
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
