import { cn } from '@/shared/utils/cn'
import { colorOf, shortName } from '../../constants/compare'
import type { ComparedCompany, SkillMention } from '../../types'
import { CompareSectionCard } from '../CompareSectionCard'

interface SkillMentionCardProps {
  /** 비교하는 기업. 이 순서로 색을 정한다 */
  readonly companies: readonly ComparedCompany[]
  readonly mentions: readonly SkillMention[]
}

/**
 * 기술스택 언급량 그래프 — Figma 432:6244
 * 기술마다 기업별 공고 수를 한 막대에 이어 붙인다. 가장 많이 언급된 기술의 막대가 끝까지 찬다
 */
export function SkillMentionCard({
  companies,
  mentions,
}: SkillMentionCardProps) {
  const totalOf = (mention: SkillMention) =>
    mention.counts.reduce((sum, { postingCount }) => sum + postingCount, 0)
  const maxTotal = Math.max(1, ...mentions.map(totalOf))

  const legend = (
    <ul className="flex items-center gap-2">
      {/* 이름은 다른 응답에서 오므로, 오기 전에는 색 점만 남지 않게 뺀다 */}
      {companies
        .filter(({ name }) => name)
        .map((company) => (
          <li
            key={company.id}
            className="flex items-center gap-1.5 text-body-xs text-gray-500"
          >
            <span
              className={cn(
                'size-1.5 rounded-full',
                colorOf(companies, company.id),
              )}
            />
            {shortName(company.name)}
          </li>
        ))}
    </ul>
  )

  return (
    <CompareSectionCard
      title="기술스택 언급량 그래프"
      aside={legend}
      className="min-w-0 flex-1"
    >
      <ul className="scrollbar-slim flex h-[124px] flex-col gap-6 overflow-y-auto">
        {mentions.map((mention) => (
          <li key={mention.skillName} className="flex items-center gap-3">
            <span className="shrink-0 truncate text-body-md font-semibold text-gray-1000">
              {mention.skillName}
            </span>
            <div className="h-4 min-w-0 flex-1 overflow-hidden rounded-full bg-element">
              {/* 기업별 조각을 감싼 막대 전체가 왼쪽부터 차오른다 — Figma 432:6289 주석 */}
              <div
                className="flex h-full animate-gauge-grow motion-reduce:animate-none"
                style={{ width: `${(totalOf(mention) / maxTotal) * 100}%` }}
              >
                {mention.counts.map(({ companyId, postingCount }) => (
                  <span
                    key={companyId}
                    title={`${postingCount}건`}
                    className={cn(
                      'h-full border-r-2 border-element last:border-r-0',
                      colorOf(companies, companyId),
                    )}
                    style={{ flexGrow: postingCount }}
                  />
                ))}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </CompareSectionCard>
  )
}
