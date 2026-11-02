import { Button } from '@/shared/components/Button'
import type {
  CommonSkill,
  ComparedCompany,
  CompanyMatchRate,
  CompanyPostingCount,
  CompanyTopSkills,
  SkillMention,
} from '../../types'
import { CommonSkillsCard } from '../CommonSkillsCard'
import { MatchRateCard } from '../MatchRateCard'
import { PostingCountCard } from '../PostingCountCard'
import { SkillMentionCard } from '../SkillMentionCard'
import { TopSkillsCard } from '../TopSkillsCard'

interface CompanyComparisonProps {
  /** 비교하는 기업. 고른 순서대로 차트 색이 정해진다 */
  readonly companies: readonly ComparedCompany[]
  readonly topSkills: readonly CompanyTopSkills[]
  readonly commonSkills: readonly CommonSkill[]
  readonly mentions: readonly SkillMention[]
  readonly matchRates: readonly CompanyMatchRate[]
  readonly postingCounts: readonly CompanyPostingCount[]
  readonly onRecompare: () => void
}

/** 기업 스택 비교 결과 — Figma 427:5220(3개)·489:2381(5개) */
export function CompanyComparison({
  companies,
  topSkills,
  commonSkills,
  mentions,
  matchRates,
  postingCounts,
  onRecompare,
}: CompanyComparisonProps) {
  return (
    <div className="flex flex-col gap-6 pb-24">
      <TopSkillsCard companies={companies} topSkills={topSkills} />
      <div className="flex gap-6">
        <CommonSkillsCard skills={commonSkills} />
        <SkillMentionCard companies={companies} mentions={mentions} />
      </div>
      <div className="flex gap-6">
        <MatchRateCard companies={companies} rates={matchRates} />
        <PostingCountCard companies={companies} counts={postingCounts} />
      </div>

      <Button
        onClick={onRecompare}
        className="fixed right-12 bottom-[42px] drop-shadow-[0_0_4px_rgba(188,114,244,0.6)]"
      >
        다시 비교하기
      </Button>
    </div>
  )
}
