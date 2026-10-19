import { useState } from 'react'
import { cn } from '@/shared/utils/cn'
import type { Company } from '../../types'

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

const EMPTY_DESCRIPTION = '기업 설명이 없습니다.'

/** 기업 선택 카드 — 로고·이름·소개. 누르면 선택이 바뀐다 */
export function CompanyCard({ company, selected, onToggle }: CompanyCardProps) {
  const description = company.description?.trim()
  /* 주소는 있는데 이미지를 못 불러오면 깨진 이미지 대신 빈 칸을 보여준다
     실패한 주소를 기억해서, 같은 기업의 로고 주소가 바뀌면 새 주소는 다시 불러온다 */
  const [failedLogoUrl, setFailedLogoUrl] = useState<string | null>(null)

  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onToggle}
      className={cn(BASE, selected ? SELECTED : UNSELECTED)}
    >
      <span className="flex w-full items-center gap-3">
        {company.logoUrl && company.logoUrl !== failedLogoUrl ? (
          <img
            src={company.logoUrl}
            alt=""
            onError={() => setFailedLogoUrl(company.logoUrl)}
            /* 실제 로고(사람인)는 가로로 길고 배경이 투명한 것이 많다. 잘리거나 어두운 카드에 묻히지
               않게 흰 정사각형 칸 안에 전체를 줄여 넣는다 — Figma는 정사각형 아이콘이라 디자이너 확인 전 임시 */
            className="size-8 shrink-0 rounded-sm bg-white object-contain p-0.5"
          />
        ) : (
          // 로고가 없거나 못 불러오면 자리만 잡아 둔다
          <span className="size-8 shrink-0 rounded-sm bg-element" />
        )}
        <span className="min-w-0 flex-1 truncate text-h3 text-white">
          {company.name}
        </span>
      </span>
      {/* Figma 408:3485 — 폭 260px, 3줄 높이. 넘치는 내용은 말줄임 대신 칸 안에서 세로 스크롤한다
          설명이 없는 기업도 많아서(stage 180곳 중 53곳) 빈 칸 대신 안내 문구를 한 단계 흐리게 보여준다 */}
      <span
        className={cn(
          'scrollbar-slim block h-[3lh] w-[260px] max-w-full overflow-y-auto text-body-sm',
          description ? 'text-gray-400' : 'text-gray-300',
        )}
      >
        {description || EMPTY_DESCRIPTION}
      </span>
    </button>
  )
}
