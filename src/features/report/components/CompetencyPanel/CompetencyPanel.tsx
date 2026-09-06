import { Chip } from '@/shared/components/Chip'
import { cn } from '@/shared/utils/cn'
import type { CompetencyRank, CompetencyTag } from '../../types'

interface CompetencyPanelProps {
  tags: readonly CompetencyTag[]
  ranks: readonly CompetencyRank[]
}

/* 강조 태그 색. Figma는 primary-400(#aa5ef1)에 흰 글씨다.
   `Chip`의 `selected`를 쓰지 않는 이유가 두 가지다.
   ① 이 태그들은 누르는 요소가 아니다 — `selected`를 주면 `<button aria-pressed>`가 되어
      상호작용이 없는데도 버튼으로 읽힌다.
   ② `selected`의 색이 primary-500이라 이 디자인(primary-400)과 한 단계 다르다(이슈 #17).
   그래서 정적 칩으로 두고 색과 글로우를 덧씌운다.
   글로우는 Figma DROP_SHADOW blur 8 · #bc72f4 60%다 — 채움(primary-400)과 글로우
   (primary-500)의 색이 서로 다르다. `Chip`의 기본 글로우는 blur 4라 여기와도 다르다. */
const HIGHLIGHT =
  'bg-primary-400 text-gray-1000 drop-shadow-[0_0_8px_rgb(188_114_244/0.6)]'

/* 태그 앞 `#`. `Chip`의 `icon` prop을 쓰지 않는다 — 그 슬롯은 16px 정사각 고정이라
   칩이 6px 넓어진다. Figma의 `#`는 아이콘이 아니라 16px 글자(폭 10)다.
   자식으로 넘기면 `Chip` 루트의 gap-1(4px)이 그대로 적용된다. */
const HASH = <span className="text-body-md">#</span>

/**
 * 채용 공고·면접에 자주 나오는 주요 역량 — 왼쪽 태그 구름, 오른쪽 순위 게이지.
 *
 * @param tags 역량 태그 목록 (일부만 강조)
 * @param ranks 비중 순위 목록
 */
export function CompetencyPanel({ tags, ranks }: CompetencyPanelProps) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-body-lg font-semibold text-gray-1000">
        채용 공고 &amp; 면접 자주 나오는 주요 역량
      </h2>

      {/* data-surface: 좌우 프리뷰 카드에서는 이 면이 한 단계 밝다(Figma 329:1217).
          프리뷰가 자기 안에서만 색을 덮어쓸 수 있게 표식만 달아 둔다. */}
      <div data-surface="panel" className="flex gap-3 rounded-sm bg-canvas p-6">
        {/* 태그 구름 — 폭이 좁아지면 줄이 늘어난다 */}
        <ul
          aria-label="자주 나오는 역량 태그"
          className="flex min-w-0 flex-[402] flex-wrap content-start gap-2"
        >
          {tags.map(({ id, label, highlighted }) => (
            <li key={id}>
              <Chip size="small" className={cn(highlighted && HIGHLIGHT)}>
                {HASH}
                {label}
              </Chip>
            </li>
          ))}
        </ul>

        <ol
          aria-label="역량 비중 순위"
          className="flex min-w-0 flex-[420] flex-col gap-2"
        >
          {ranks.map(({ id, label, percent }, index) => (
            <li key={id} className="flex h-6 items-center gap-2">
              <span className="text-body-xs text-gray-400">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="w-25 truncate text-body-sm font-semibold text-gray-1000">
                {label}
              </span>

              {/* 게이지 — 트랙은 gray-200, 채움은 primary-400 (Figma 335:2424).
                  진입 시 왼쪽에서 오른쪽으로 차오른다 (Figma 335:2437 주석). */}
              <span
                className="h-1.5 min-w-0 flex-1 rounded-full bg-gray-200"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={percent}
                aria-label={label}
              >
                <span
                  className="block h-full animate-gauge-grow rounded-full bg-primary-400 motion-reduce:animate-none"
                  style={{ width: `${percent}%` }}
                />
              </span>

              <span className="w-9 shrink-0 text-right text-body-xs text-gray-400">
                {percent}%
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
