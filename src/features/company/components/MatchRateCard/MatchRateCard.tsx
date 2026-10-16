import { cn } from '@/shared/utils/cn'
import { colorOf, MAX_COMPARE, twoDigits } from '../../constants/compare'
import type { Company, CompanyMatchRate } from '../../types'
import { CompareSectionCard } from '../CompareSectionCard'

interface MatchRateCardProps {
  /** 비교하는 기업. 이 순서로 색을 정한다 */
  readonly companies: readonly Company[]
  readonly rates: readonly CompanyMatchRate[]
}

/** 회사 매칭률 — Figma 435:6328. 비교 상한(5)까지 빈 줄로 채운다 */
export function MatchRateCard({ companies, rates }: MatchRateCardProps) {
  const emptyRows = Math.max(0, MAX_COMPARE - rates.length)

  return (
    <CompareSectionCard title="회사 매칭률" className="min-w-0 flex-1">
      <ol className="flex flex-col gap-1">
        {rates.map((rate, index) => (
          <li key={rate.companyId} className="flex h-6 items-center gap-2">
            <span className="text-body-xs text-gray-400">
              {twoDigits(index + 1)}
            </span>
            <span className="w-[100px] shrink-0 truncate text-body-sm font-semibold text-gray-1000">
              {rate.name}
            </span>
            <span className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-[5px] bg-gray-200">
              <span
                className={cn(
                  'block h-full animate-gauge-grow rounded-[5px] motion-reduce:animate-none',
                  colorOf(companies, rate.companyId),
                )}
                style={{ width: `${rate.matchRate}%` }}
              />
            </span>
            <span className="w-9 shrink-0 text-center text-body-xs text-gray-400">
              {rate.matchRate}%
            </span>
          </li>
        ))}
        {Array.from({ length: emptyRows }, (_, index) => (
          <li
            key={`empty-${index}`}
            aria-hidden="true"
            className="flex h-6 items-center gap-2 text-gray-300"
          >
            <span className="text-body-xs">00</span>
            <span className="w-[100px] shrink-0 text-body-sm">(비어있음)</span>
            <span className="h-1.5 min-w-0 flex-1 rounded-[5px] bg-gray-100" />
            <span className="w-9 shrink-0 text-center text-body-xs">--%</span>
          </li>
        ))}
      </ol>
    </CompareSectionCard>
  )
}
