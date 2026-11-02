import { cn } from '@/shared/utils/cn'
import { colorOf, shortName } from '../../constants/compare'
import type { ComparedCompany, CompanyPostingCount } from '../../types'
import { CompareSectionCard } from '../CompareSectionCard'

interface PostingCountCardProps {
  /** 비교하는 기업. 이 순서로 색을 정한다 */
  readonly companies: readonly ComparedCompany[]
  readonly counts: readonly CompanyPostingCount[]
}

/* 가장 많은 기업의 막대 높이 — Figma 435:6458 */
const MAX_BAR_PX = 78

/** 채용 공고 수 세로 막대 — Figma 435:6401. 기업 하나에 110px 칸, 카드는 칸 수만큼 넓어진다 */
export function PostingCountCard({ companies, counts }: PostingCountCardProps) {
  const max = Math.max(1, ...counts.map(({ postingCount }) => postingCount))

  return (
    <CompareSectionCard title="채용 공고 수" className="shrink-0">
      <div className="flex flex-col items-center gap-1.5">
        <div className="flex h-28 items-end rounded-sm bg-canvas px-9">
          {counts.map(({ companyId, postingCount }) => (
            <div
              key={companyId}
              className="flex w-[110px] flex-col items-center"
            >
              <span className="text-body-xs text-gray-300">
                {postingCount}건
              </span>
              <span
                className={cn(
                  'w-10 animate-bar-grow rounded-t-xs motion-reduce:animate-none',
                  colorOf(companies, companyId),
                )}
                style={{ height: (postingCount / max) * MAX_BAR_PX }}
              />
            </div>
          ))}
        </div>
        <div className="flex px-9">
          {counts.map(({ companyId, name }) => (
            <span
              key={companyId}
              className="w-[110px] truncate text-center text-body-xs text-gray-500"
            >
              {shortName(name)}
            </span>
          ))}
        </div>
      </div>
    </CompareSectionCard>
  )
}
