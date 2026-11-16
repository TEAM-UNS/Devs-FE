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
    /* 코드 순서는 모바일 순서(언급량 → 인기 스택 → 공통 기술 → 매칭률 → 공고 수, Figma 2339:16962)다.
       읽는 순서가 화면 순서와 같아야 해서 순서를 CSS로 뒤집지 않고, 패드부터는 그리드 자리로 PC 배치를 만든다.
       공통 기술 열은 PC·패드 모두 346 (1396:7925 · 2339:16588) */
    <div className="grid gap-6 md:grid-cols-[346px_minmax(0,1fr)] md:pb-24">
      <SkillMentionCard
        companies={companies}
        mentions={mentions}
        className="md:col-start-2 md:row-start-2"
      />
      <TopSkillsCard
        companies={companies}
        topSkills={topSkills}
        className="md:col-span-2 md:row-start-1"
      />
      <CommonSkillsCard
        skills={commonSkills}
        className="md:col-start-1 md:row-start-2"
      />
      {/* 매칭률:공고 수 = 패드 288:500, PC 반반 */}
      <div className="grid gap-6 md:col-span-2 md:grid-cols-[288fr_500fr] lg:grid-cols-2">
        <MatchRateCard companies={companies} rates={matchRates} />
        <PostingCountCard companies={companies} counts={postingCounts} />
      </div>

      {/* 모바일은 목록 끝에 꽉 차게 놓고, 패드부터는 오른쪽 아래에 띄운다 */}
      <Button
        onClick={onRecompare}
        className="drop-shadow-[0_0_4px_rgba(188,114,244,0.6)] md:fixed md:right-12 md:bottom-[42px]"
      >
        다시 비교하기
      </Button>
    </div>
  )
}
