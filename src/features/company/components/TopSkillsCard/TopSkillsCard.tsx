import { cn } from '@/shared/utils/cn'
import { colorOf, twoDigits } from '../../constants/compare'
import type { ComparedCompany, CompanyTopSkills } from '../../types'
import { CompareSectionCard } from '../CompareSectionCard'

interface TopSkillsCardProps {
  /** 비교하는 기업. 이 순서로 색을 정한다 */
  readonly companies: readonly ComparedCompany[]
  readonly topSkills: readonly CompanyTopSkills[]
}

/** 기업별 인기 스택 비교 — Figma 432:6022. 기업 수만큼 같은 폭으로 나눈다 */
export function TopSkillsCard({ companies, topSkills }: TopSkillsCardProps) {
  return (
    <CompareSectionCard title="기업별 인기 스택 비교">
      <div className="flex gap-9 rounded-sm bg-canvas px-6 py-3">
        {topSkills.map((company) => (
          <div
            key={company.companyId}
            className="flex min-w-0 flex-1 flex-col gap-3"
          >
            <p className="flex items-center gap-2 border-b border-gray-200 py-2 text-body-md font-semibold text-gray-1000">
              <span
                className={cn(
                  'size-1.5 shrink-0 rounded-full',
                  colorOf(companies, company.companyId),
                )}
              />
              <span className="truncate">{company.name}</span>
            </p>
            <ol className="flex flex-col gap-3">
              {company.skills.map((skill) => (
                <li
                  key={skill.rank}
                  className="flex items-center justify-between"
                >
                  <span className="flex min-w-0 flex-1 items-center gap-2">
                    <span className="text-body-xs text-gray-400">
                      {twoDigits(skill.rank)}
                    </span>
                    <span className="truncate text-body-sm font-semibold text-gray-1000">
                      {skill.skillName}
                    </span>
                  </span>
                  <span className="w-9 shrink-0 text-center text-body-xs text-gray-400">
                    {skill.percentage}%
                  </span>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </CompareSectionCard>
  )
}
