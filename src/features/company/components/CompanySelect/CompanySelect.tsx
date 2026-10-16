import { Button } from '@/shared/components/Button'
import { Chip } from '@/shared/components/Chip'
import { SearchIcon } from '@/shared/components/icons'
import { MIN_COMPARE } from '../../constants/compare'
import type { Company } from '../../types'
import { CompanyCard } from '../CompanyCard'

interface CompanySelectProps {
  /** 검색어에 맞는 기업 */
  readonly companies: readonly Company[]
  /** 고른 기업. 고른 순서대로 칩이 놓인다 */
  readonly selected: readonly Company[]
  readonly keyword: string
  readonly onKeywordChange: (keyword: string) => void
  readonly onToggle: (id: number) => void
  readonly onCompare: () => void
}

/**
 * 기업 고르기 화면 — Figma 408:3115(선택함)·427:4136(선택 전)
 * 검색창·선택 칩은 위에 고정하고 카드 목록만 스크롤한다. 비교 버튼은 오른쪽 아래 고정
 */
export function CompanySelect({
  companies,
  selected,
  keyword,
  onKeywordChange,
  onToggle,
  onCompare,
}: CompanySelectProps) {
  const canCompare = selected.length >= MIN_COMPARE

  return (
    <div className="flex h-full flex-col items-center gap-8">
      <div className="flex w-[700px] max-w-full shrink-0 flex-col gap-3">
        <label className="flex h-[42px] items-center gap-1 rounded-full bg-element px-5 text-gray-400">
          <SearchIcon className="size-6 shrink-0" />
          <span className="sr-only">기업 검색</span>
          <input
            type="search"
            value={keyword}
            onChange={(event) => onKeywordChange(event.currentTarget.value)}
            placeholder="원하는 기업을 검색하세요"
            className="min-w-0 flex-1 bg-transparent text-body-md text-gray-1000 outline-none placeholder:text-gray-300"
          />
        </label>
        {selected.length > 0 && (
          /* 칩 줄은 높이가 낮아 스크롤바가 칩을 가린다. 막대만 숨기고 가로 스크롤은 그대로 둔다 */
          <ul
            className="flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            aria-label="선택한 기업"
          >
            {selected.map(({ id, name }) => (
              <li key={id} className="shrink-0">
                <Chip
                  size="small"
                  onRemove={() => onToggle(id)}
                  removeLabel={`${name} 선택 해제`}
                >
                  {name}
                </Chip>
              </li>
            ))}
          </ul>
        )}
      </div>

      <ul className="grid min-h-0 w-full flex-1 grid-cols-3 content-start items-start gap-8 overflow-y-auto pb-24">
        {companies.map((company) => (
          <li key={company.id}>
            <CompanyCard
              company={company}
              selected={selected.some(({ id }) => id === company.id)}
              onToggle={() => onToggle(company.id)}
            />
          </li>
        ))}
      </ul>

      <Button
        disabled={!canCompare}
        onClick={onCompare}
        className="fixed right-12 bottom-[42px] enabled:drop-shadow-[0_0_4px_rgba(188,114,244,0.6)]"
      >
        {canCompare
          ? `선택한 ${selected.length}개 기업 스택 비교하기`
          : `${MIN_COMPARE}개 이상의 기업을 선택해주세요.`}
      </Button>
    </div>
  )
}
