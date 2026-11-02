import { cn } from '@/shared/utils/cn'
import type { CommonSkill } from '../../types'
import { CompareSectionCard } from '../CompareSectionCard'

interface CommonSkillsCardProps {
  readonly skills: readonly CommonSkill[]
}

/** 공통 요구 기술 — Figma 432:6116. 모든 기업이 요구하면 배지를 보라로 강조한다 */
export function CommonSkillsCard({ skills }: CommonSkillsCardProps) {
  return (
    <CompareSectionCard title="공통 요구 기술" className="w-[346px] shrink-0">
      <ul className="scrollbar-slim flex h-[124px] flex-col gap-2 overflow-y-auto">
        {skills.map((skill) => (
          <li
            key={skill.skillName}
            className="flex items-start justify-between rounded-xs bg-canvas px-3 py-1.5"
          >
            <span className="truncate text-body-md font-semibold text-gray-1000">
              {skill.skillName}
            </span>
            <span
              className={cn(
                'shrink-0 rounded-full px-3 py-0.5 text-body-xs text-gray-1000',
                skill.companyCount === skill.totalCompanyCount
                  ? 'bg-primary-400'
                  : 'bg-element',
              )}
            >
              {skill.companyCount}/{skill.totalCompanyCount}
            </span>
          </li>
        ))}
      </ul>
    </CompareSectionCard>
  )
}
