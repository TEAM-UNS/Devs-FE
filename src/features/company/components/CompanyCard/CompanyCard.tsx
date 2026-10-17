import type { Company } from '../../types'
import { cn } from '@/shared/utils/cn'

interface CompanyCardProps {
  readonly company: Company
  readonly selected: boolean
  readonly onToggle: () => void
}

/* Figma 셀렉트카드(408:2476). 선택되면 보라 테두리·글로우에 canvas 위로 primary-400 15%를 깐다
   Figma 테두리는 안쪽에 그려져 크기에 안 들어가서 border 대신 ring-inset을 쓴다 */
const BASE =
  'flex w-full flex-col gap-4 rounded-sm p-5 ring-1 ring-inset text-left focus-visible:outline-2 focus-visible:outline-primary-500'
const SELECTED =
  'bg-canvas ring-primary-400 bg-[linear-gradient(rgb(170_94_241/0.15),rgb(170_94_241/0.15))] drop-shadow-[0_0_4px_rgba(188,114,244,0.6)]'
const UNSELECTED = 'bg-container ring-element'

/** 기업 선택 카드 — 로고·이름·소개. 누르면 선택이 바뀐다 */
export function CompanyCard({ company, selected, onToggle }: CompanyCardProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onToggle}
      className={cn(BASE, selected ? SELECTED : UNSELECTED)}
    >
      <span className="flex w-full items-center gap-3">
        {company.logoUrl ? (
          <img
            src={company.logoUrl}
            alt=""
            className="size-8 shrink-0 rounded-sm object-cover"
          />
        ) : (
          // 로고가 서버에 생기기 전까지 자리만 잡아 둔다
          <span className="size-8 shrink-0 rounded-sm bg-element" />
        )}
        <span className="min-w-0 flex-1 truncate text-h3 text-white">
          {company.name}
        </span>
      </span>
      {/* Figma 408:3485 — 폭 260px, 3줄까지 보이고 넘치면 말줄임. 짧아도 3줄 높이를 잡아 카드 높이를 맞춘다 */}
      <span className="line-clamp-3 min-h-[3lh] w-[260px] max-w-full text-body-sm text-gray-400">
        {company.description}
      </span>
    </button>
  )
}
